import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { networkInterfaces } from 'os';
import dotenv from 'dotenv';
import { GeminiTryOn } from '../gemini_tryon.js';
import { 
    testConnection, 
    initializeDatabase, 
    createTryOnResult, 
    getTryOnResultsByUserId,
    deleteTryOnResult 
} from './database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from './database.js';
import cron from 'node-cron';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.post('/api/try-on', upload.fields([
    { name: 'personImage', maxCount: 1 },
    { name: 'garmentImage', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log('Received try-on request');
        console.log('Files:', req.files);
        
        if (!req.files.personImage || !req.files.garmentImage) {
            return res.status(400).json({ 
                success: false,
                error: 'Both person and garment images are required' 
            });
        }

        const personImagePath = req.files.personImage[0].path;
        const garmentImagePath = req.files.garmentImage[0].path;

        console.log('Processing images:', { personImagePath, garmentImagePath });

        const model = new GeminiTryOn();
        const resultPath = await model.tryOn(personImagePath, garmentImagePath);

        console.log('Generated result:', resultPath);

        // Generate URLs for the images
        const baseUrl = `http://localhost:${port}`;
        const personImageUrl = `${baseUrl}/${personImagePath}`;
        const garmentImageUrl = `${baseUrl}/${garmentImagePath}`;
        const resultImageUrl = `${baseUrl}/${resultPath}`;

        // For now, use a default user ID (you can implement authentication later)
        const userId = req.body.userId || 'default-user-id';
        
        // Save to database
        const resultId = uuidv4();
        await createTryOnResult({
            id: resultId,
            user_id: userId,
            person_image_url: personImageUrl,
            clothing_image_url: garmentImageUrl,
            result_image_url: resultImageUrl
        });

        res.json({
            success: true,
            resultImage: path.basename(resultPath),
            resultId: resultId
        });
    } catch (error) {
        console.error('Error in try-on:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Check if user already exists
        const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        await pool.execute(
            'INSERT INTO users (id, email, username, avatar_url, created_at, updated_at, password) VALUES (?, ?, ?, ?, NOW(), NOW(), ?)',
            [userId, email, name, '', hashedPassword]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Return user info and a dummy token
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.username
            },
            token: 'dummy-token',
            success: true
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get try-on history for a user
app.get('/api/try-on/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const results = await getTryOnResultsByUserId(userId);
        res.json({
            success: true,
            results: results
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete a try-on result
app.delete('/api/try-on/:resultId', async (req, res) => {
    try {
        const { resultId } = req.params;
        const userId = req.body.userId || 'default-user-id'; // You can implement proper auth later
        
        await deleteTryOnResult(resultId, userId);
        res.json({
            success: true,
            message: 'Try-on result deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting result:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Virtual Try-On API is running' });
});

// Scheduled job to delete expired try-on results every hour
cron.schedule('0 * * * *', async () => {
    try {
        const [result] = await pool.execute('DELETE FROM try_on_results WHERE expires_at < NOW()');
        if (result.affectedRows > 0) {
            console.log(`🗑️  Deleted ${result.affectedRows} expired try-on results from the database.`);
        }
    } catch (err) {
        console.error('Error deleting expired try-on results:', err);
    }
});

// Helper function to get local IP address
function getLocalIP() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

// Initialize database and start server
async function startServer() {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Please check your MySQL connection.');
            process.exit(1);
        }

        // Initialize database tables
        await initializeDatabase();

        // Start server
        app.listen(port, () => {
            console.clear();
            console.log('\x1b[36m%s\x1b[0m', '🚀 Virtual Try-On Server is running!');
            console.log('\x1b[32m%s\x1b[0m', `
    API Endpoints:
    ➜ Health Check:     http://localhost:${port}/api/health
    ➜ Try-On API:       http://localhost:${port}/api/try-on
    ➜ History:          http://localhost:${port}/api/try-on/history/:userId
    ➜ Delete Result:    http://localhost:${port}/api/try-on/:resultId
    ➜ Uploads:          http://localhost:${port}/uploads/
            `);
            console.log('\x1b[33m%s\x1b[0m', 'Frontend should run on http://localhost:5173');
            console.log('\x1b[33m%s\x1b[0m', 'Press Ctrl+C to stop the server');
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
}

startServer(); 