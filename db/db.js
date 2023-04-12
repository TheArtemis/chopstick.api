const { Pool } = require('pg');

const pool = new Pool({
    user: 'your-username',
    host: 'your-hostname',
    database: 'your-database',
    password: 'your-password',
    port: 'your-port'
});

/* 
When a connection is established to a database, it creates a new process on the database server.
Creating a new process for each database request can be slow and resource-intensive, 
so connection pooling is used to minimize the overhead of creating and tearing down database connections.
 */

module.exports = pool;