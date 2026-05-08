const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Testing connection with 127.0.0.1...');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Connection failed!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        process.exit(1);
    }
    console.log('Successfully connected to 127.0.0.1.');
    connection.end();
});
