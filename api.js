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

/* app.post('/login', (req, res) => {
    const {username, password} = req.body;
    pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, result) => {
        if(err)
            res.send(err);
        else
            res.send(result.rows);
    })
}); */


server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
