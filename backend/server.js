import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { networkInterfaces } from 'os';
import { GeminiTryOn } from '../gemini_tryon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

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
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Serve static files from frontend directory
app.use(express.static('frontend'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.post('/api/try-on', upload.fields([
    { name: 'personImage', maxCount: 1 },
    { name: 'garmentImage', maxCount: 1 }
]), async (req, res) => {
    try {
        if (!req.files.personImage || !req.files.garmentImage) {
            return res.status(400).json({ error: 'Both person and garment images are required' });
        }

        const personImagePath = req.files.personImage[0].path;
        const garmentImagePath = req.files.garmentImage[0].path;

        const model = new GeminiTryOn();
        const resultPath = await model.tryOn(personImagePath, garmentImagePath);

        res.json({
            success: true,
            resultImage: path.basename(resultPath)
        });
    } catch (error) {
        console.error('Error in try-on:', error);
        res.status(500).json({ error: error.message });
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

// Start server
app.listen(port, () => {
    console.clear();
    console.log('\x1b[36m%s\x1b[0m', '🚀 Virtual Try-On Server is running!');
    console.log('\x1b[32m%s\x1b[0m', `
    Access the application:
    ➜ Local:            http://localhost:${port}
    ➜ On Your Network:  http://${getLocalIP()}:${port}
    `);
    console.log('\x1b[33m%s\x1b[0m', 'Press Ctrl+C to stop the server');
}); 