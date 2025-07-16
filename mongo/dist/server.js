"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const node_cron_1 = __importDefault(require("node-cron"));
const TryOnSession_1 = require("./models/TryOnSession");
const Image_1 = require("./models/Image");
const fs_1 = __importDefault(require("fs"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const upload_1 = __importDefault(require("./routes/upload"));
const tryOn_1 = __importDefault(require("./routes/tryOn"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
].filter(Boolean);
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(limiter);
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', (req, res, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}, express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/tryOn', tryOn_1.default);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
node_cron_1.default.schedule('0 * * * *', async () => {
    try {
        const now = new Date();
        const expiredSessions = await TryOnSession_1.TryOnSession.find({
            createdAt: { $lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
        });
        for (const session of expiredSessions) {
            if (session.resultImageId) {
                const image = await Image_1.Image.findById(session.resultImageId);
                if (image) {
                    if (image.url && image.url.startsWith('/uploads/')) {
                        const filePath = `${process.cwd()}${image.url}`;
                        if (fs_1.default.existsSync(filePath)) {
                            fs_1.default.unlinkSync(filePath);
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
    }
    catch (err) {
        console.error('[CRON] Error deleting expired sessions/images:', err);
    }
});
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        console.log('✅ Database connected successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map