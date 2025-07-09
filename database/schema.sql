-- Virtual Try-On System Database Schema
-- Run this in SQL Workbench to create the database structure

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS virtual_tryon;
USE virtual_tryon;

-- Users table (optional for future user management)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Try-on sessions table (to track usage)
CREATE TABLE IF NOT EXISTS tryon_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    person_image_path VARCHAR(255) NOT NULL,
    garment_image_path VARCHAR(255) NOT NULL,
    result_image_path VARCHAR(255) NOT NULL,
    status ENUM('processing', 'completed', 'failed') DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    error_message TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Usage statistics table
CREATE TABLE IF NOT EXISTS usage_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    total_requests INT DEFAULT 0,
    successful_requests INT DEFAULT 0,
    failed_requests INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- Insert sample data for testing
INSERT INTO users (username, email) VALUES 
('test_user', 'test@example.com');

-- Create indexes for better performance
CREATE INDEX idx_tryon_sessions_user_id ON tryon_sessions(user_id);
CREATE INDEX idx_tryon_sessions_created_at ON tryon_sessions(created_at);
CREATE INDEX idx_usage_stats_date ON usage_stats(date); 