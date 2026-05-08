-- SQL Schema for SIXS CSS Website
-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ilitmysport_sixscss_db;
USE ilitmysport_sixscss_db;

-- Create the enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    source VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create the user if you are using a local root account
-- GRANT ALL PRIVILEGES ON ilitmysport_sixscss_db.* TO 'ilitmysport_sixscss_user'@'localhost' IDENTIFIED BY 'CSSsixs@123';
-- FLUSH PRIVILEGES;
