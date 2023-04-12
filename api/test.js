const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pool = require('./db/db')

app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
        res.send('User added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});