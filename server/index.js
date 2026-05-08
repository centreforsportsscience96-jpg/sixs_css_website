const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Database Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('-----------------------------------------');
        console.error('DATABASE CONNECTION ERROR:');
        console.error('Code:', err.code);
        console.error('Message:', err.message || 'No error message provided by driver.');
        
        if (err.code === 'ECONNREFUSED') {
            console.error('\nTIP: MySQL server is not responding at ' + (process.env.DB_HOST || 'localhost') + ':3306');
            console.error('1. Ensure XAMPP/WAMP or MySQL service is RUNNING.');
            console.error('2. If you are developing locally, check if DB_HOST should be "127.0.0.1".');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\nTIP: Access denied. Check your DB_USER and DB_PASS in .env');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('\nTIP: Database "' + process.env.DB_NAME + '" does not exist.');
        }
        console.error('-----------------------------------------');
    } else {
        console.log('Successfully connected to MySQL Database (' + process.env.DB_NAME + ')');
        connection.release();
    }
});

// ROOT ROUTE
app.get('/', (req, res) => {
    res.send('Centre for Sports Science API is running...');
});

// INFO ROUTE
app.get('/api/info', (req, res) => {
    res.json({
        success: true,
        message: "Centre for Sports Science API is running",
        db_name: process.env.DB_NAME
    });
});

// ENQUIRY ROUTE
app.post('/api/enquiries', (req, res) => {

    const {
        fullName,
        email,
        phone,
        location,
        source,
        message
    } = req.body;

    if (
        !fullName ||
        !email ||
        !phone ||
        !location ||
        !source ||
        !message
    ) {

        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });

    }

    const query = `
        INSERT INTO enquiries
        (
            full_name,
            email,
            phone,
            location,
            source,
            message
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    pool.query(
        query,
        [
            fullName,
            email,
            phone,
            location,
            source,
            message
        ],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: 'Database Error'
                });

            }

            res.json({
                success: true,
                message: 'Enquiry Submitted Successfully'
            });

        }
    );

});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});