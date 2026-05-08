const mysql = require('mysql2');
require('dotenv').config({ path: './server/.env' });

console.log('Testing connection with:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Connection failed!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        console.error('Error Stack:', err.stack);
        process.exit(1);
    }
    console.log('Successfully connected to the database.');
    connection.end();
});
