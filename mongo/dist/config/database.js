"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const maskMongoUri = (uri) => {
    return uri.replace(/(mongodb(?:\+srv)?:\/\/)(.*:.*)@/, '$1****:****@');
};
const connectDatabase = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual-try-on';
        console.log('[MongoDB] Attempting to connect to:', maskMongoUri(mongoURI));
        const options = {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            w: 'majority',
        };
        const conn = await mongoose_1.default.connect(mongoURI, options);
        console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error('[MongoDB] Connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('[MongoDB] Disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('[MongoDB] Reconnected');
        });
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            console.log('[MongoDB] Connection closed due to app termination');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('[MongoDB] Database connection failed:', error);
        if (error instanceof Error) {
            console.error('[MongoDB] Reason:', error.message);
        }
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map