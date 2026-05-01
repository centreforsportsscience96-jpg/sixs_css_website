const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use pool.getConnection to check connectivity
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        console.log('TIP: Ensure your MySQL server (XAMPP/WAMP) is running on port 3306.');
        return;
    }
    console.log('Connected to the MySQL database.');
    connection.release();
});

app.get('/', (req, res) => {
    res.send('Centre for Sports Science API is running...');
});

// Example route to fetch some data
app.get('/api/info', (req, res) => {
    pool.getConnection((err, connection) => {
        const dbStatus = err ? 'offline' : 'connected';
        if (connection) connection.release();
        
        res.json({
            name: "Centre for Sports Science",
            location: "Bangalore, India",
            description: "State-of-the-art sports science facility providing high-performance support to athletes.",
            dbStatus: dbStatus
        });
    });
});

// Route to handle enquiry submissions
app.post('/api/enquiry', (req, res) => {
    const { fullName, email, phone, location, source, message } = req.body;
    
    const query = 'INSERT INTO enquiries (full_name, email, phone, location, source, message) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(query, [fullName, email, phone, location, source, message], (err, result) => {
        if (err) {
            console.error('Error inserting enquiry:', err.message);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        res.status(200).json({ message: 'Enquiry submitted successfully', id: result.insertId });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
