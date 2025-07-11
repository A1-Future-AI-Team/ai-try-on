import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'demo123',
    database: 'tryon_studio',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Initialize database tables
export async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(100) UNIQUE,
                avatar_url TEXT,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create try_on_results table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS try_on_results (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                person_image_url TEXT NOT NULL,
                clothing_image_url TEXT NOT NULL,
                result_image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Create indexes
        await connection.execute(`
            CREATE INDEX IF NOT EXISTS idx_try_on_results_user_id ON try_on_results(user_id)
        `);
        
        await connection.execute(`
            CREATE INDEX IF NOT EXISTS idx_try_on_results_created_at ON try_on_results(created_at)
        `);
        
        await connection.execute(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
        `);

        connection.release();
        console.log('✅ Database tables initialized successfully!');
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        return false;
    }
}

// Database operations
export async function createUser(userData) {
    try {
        const [result] = await pool.execute(
            'INSERT INTO users (id, email, username) VALUES (?, ?, ?)',
            [userData.id, userData.email, userData.username]
        );
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getUserById(userId) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

export async function getUserByEmail(email) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

export async function createTryOnResult(resultData) {
    try {
        const [result] = await pool.execute(
            `INSERT INTO try_on_results 
            (id, user_id, person_image_url, clothing_image_url, result_image_url, expires_at) 
            VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))`,
            [resultData.id, resultData.user_id, resultData.person_image_url, resultData.clothing_image_url, resultData.result_image_url]
        );
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getTryOnResultsByUserId(userId) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM try_on_results WHERE user_id = ? AND created_at >= NOW() - INTERVAL 1 DAY ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getTryOnResultById(resultId) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM try_on_results WHERE id = ?',
            [resultId]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

export async function deleteTryOnResult(resultId, userId) {
    try {
        const [result] = await pool.execute(
            'DELETE FROM try_on_results WHERE id = ? AND user_id = ?',
            [resultId, userId]
        );
        return result;
    } catch (error) {
        throw error;
    }
}

export default pool; 