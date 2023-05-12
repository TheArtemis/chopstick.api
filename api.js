const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const http = require('http');
const server = http.createServer(app);
const {v4: uuidv4} = require('uuid');

const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

const pool = new Pool({
    user: 'lemon',
    host: 'localhost',
    database: 'chopsticks',
    password: 'happylemon',
    port: 6543,
});

async function authenticateUser(username, password) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if(result.rows.length === 0)
        throw Error('User not found');
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
        throw Error('Password incorrect');
    
    return true;
}

async function createUser(username, password, email) {
    if(username == '' || password == '' || email == '')
        throw new Error('Invalid input');    

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    /* Check if user already exixts */
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    if (result.rows.length > 0) {
        throw new Error('Username already taken');
    }

    /* Check if mail already exists */
    const query2 = 'SELECT * FROM users WHERE email = $1';
    const result2 = await pool.query(query2, [email]);
    if (result2.rows.length > 0) {
        throw new Error('An account with this mail already exists');
    }

    /* Insert user into database */
    const insertQuery = 'INSERT INTO users (id, username, password, email) VALUES ($1, $2, $3, $4)';
    const values = [userId, username, hashedPassword, email];
    await pool.query(insertQuery, values);

    console.log('User created successfully');
}

const verifyToken = (req, res, next) => {
    
    const token = req.headers.authorization;
    console.log("trying to verify token");
    console.log(token);
    if (!token) {   
      console.log("token not provided");   
      return res.status(401).json({ message: 'Authentication token not provided.' });
    }  
    try {
      console.log("trying to decode token")
      const decoded = jwt.verify(token, SECRET_KEY);  
      
      req.username = decoded.username;
      /* console.log(decoded); */
      console.log("token decoded");
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {      
      /* console.log(error); */
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }
  };

app.get('/test', (req, res) => {
    res.send('Hello World');
});

app.post('/register', async (req, res) => {
    try {
        const {username, password, mail} = req.body;        
        await createUser(username, password, mail);
        res.status(201).send('User created successfully!');
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    
    try {
        const {username, password} = req.body;        
        await authenticateUser(username, password);
        const token = jwt.sign({username}, SECRET_KEY);
        console.log("User " + username + " logged in with token " + token);
        res.status(200).json({token});
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});

app.get('/users', verifyToken, async (req, res) => {
    try {
        console.log("User " + req.username + " requested user data");
        const user = req.username;
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [user]);
        res.status(200).json(result.rows[0]);
    }catch(error) {
        console.error(error.message);
        res.status(500).send(error.message);
    };
});
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

app.post('/add-game', verifyToken, async (req, res) => {
    try {
        /* console.log(req); */
        const user = req.username;
        /* console.log(req.body) */
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        const gameId = uuidv4();
        const query = 'INSERT INTO games (gameid, player1, player2, winner, game_date) VALUES ($1, $2, $3, $4, $5)';
        const result = await pool.query(query, [gameId, user, req.body.player2, req.body.winner, formattedDate]);
        res.status(200).send('Game added successfully');
        
    }catch(error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
