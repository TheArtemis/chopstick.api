const express = require('express');
const { Pool } = require('pg');

const app = express();

// Create a new connection pool to the Postgres database
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_password',
    port: 5432,
});

// Define a simple route
app.get('/', (req, res) => {
    pool.query('SELECT NOW()', (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(result.rows[0].now);
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});