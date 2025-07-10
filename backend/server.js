import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { networkInterfaces } from 'os';
import dotenv from 'dotenv';
import { GeminiTryOn } from '../gemini_tryon.js';

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

        res.json({
            success: true,
            resultImage: path.basename(resultPath)
        });
    } catch (error) {
        console.error('Error in try-on:', error);
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

// Start server
app.listen(port, () => {
    console.clear();
    console.log('\x1b[36m%s\x1b[0m', '🚀 Virtual Try-On Server is running!');
    console.log('\x1b[32m%s\x1b[0m', `
    API Endpoints:
    ➜ Health Check:     http://localhost:${port}/api/health
    ➜ Try-On API:       http://localhost:${port}/api/try-on
    ➜ Uploads:          http://localhost:${port}/uploads/
    `);
    console.log('\x1b[33m%s\x1b[0m', 'Frontend should run on http://localhost:5173');
    console.log('\x1b[33m%s\x1b[0m', 'Press Ctrl+C to stop the server');
}); 