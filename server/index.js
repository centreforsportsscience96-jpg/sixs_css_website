const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// It will look for MONGO_URI in your .env file
console.log("Mongo URI Loaded: SUCCESS");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Successfully connected to MongoDB Database'))
    .catch((err) => {
        console.error('FULL ERROR OBJECT:');
        console.error(err);
    });

// --- MONGOOSE SCHEMA & MODEL ---
// This replaces your MySQL "CREATE TABLE" command
const enquirySchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    source: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create the model (MongoDB will automatically create a collection named "enquiries")
const Enquiry = mongoose.model('Enquiry', enquirySchema);

// --- ROUTES ---

// ROOT ROUTE
app.get('/', (req, res) => {
    res.send('Centre for Sports Science API is running...');
});

// INFO ROUTE
app.get('/api/info', (req, res) => {
    res.json({
        success: true,
        message: "Centre for Sports Science API is running",
        db_type: "MongoDB"
    });
});

// ENQUIRY ROUTE
app.post('/api/enquiries', async (req, res) => {
    const { fullName, email, phone, location, source, message } = req.body;

    // Validation
    if (!fullName || !email || !phone || !location || !source || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        // Create a new document using the model
        const newEnquiry = new Enquiry({
            fullName,
            email,
            phone,
            location,
            source,
            message
        });

        // Save it to MongoDB
        await newEnquiry.save();

        res.json({
            success: true,
            message: 'Enquiry Submitted Successfully'
        });

    } catch (err) {
        console.error("Failed to save enquiry:", err);
        res.status(500).json({
            success: false,
            message: 'Database Error'
        });
    }
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});