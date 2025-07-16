import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import cron from 'node-cron';
import { TryOnSession } from './models/TryOnSession';
import { Image } from './models/Image';
import fs from 'fs';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import uploadRoutes from './routes/upload';
import tryOnRoutes from './routes/tryOn';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration - allow multiple frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3000',
  'https://ai-try-on-mu.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory with proper headers
app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tryOn', tryOnRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Scheduled job: Delete expired try-on sessions and images every hour
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    // Find sessions older than 24 hours
    const expiredSessions = await TryOnSession.find({
      createdAt: { $lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
    });
    for (const session of expiredSessions) {
      // Delete associated result image if exists
      if (session.resultImageId) {
        const image = await Image.findById(session.resultImageId);
        if (image) {
          // Remove file from disk if stored locally
          if (image.url && image.url.startsWith('/uploads/')) {
            const filePath = `${process.cwd()}${image.url}`;
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
          await image.deleteOne();
        }
      }
      await session.deleteOne();
    }
    if (expiredSessions.length > 0) {
      console.log(`[CRON] Deleted ${expiredSessions.length} expired try-on sessions and their images.`);
    }
  } catch (err) {
    console.error('[CRON] Error deleting expired sessions/images:', err);
  }
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 