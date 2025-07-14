"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryOnSession = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const tryOnSessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    sessionId: {
        type: String,
        required: [true, 'Session ID is required'],
    },
    modelImageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Image',
        required: [true, 'Model image ID is required'],
    },
    dressImageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Image',
        required: [true, 'Dress image ID is required'],
    },
    resultImageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Image',
        default: null,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    processingStartedAt: {
        type: Date,
        default: null,
    },
    processingCompletedAt: {
        type: Date,
        default: null,
    },
    errorMessage: {
        type: String,
        default: null,
    },
    metadata: {
        modelImageUrl: {
            type: String,
            required: [true, 'Model image URL is required'],
        },
        dressImageUrl: {
            type: String,
            required: [true, 'Dress image URL is required'],
        },
        resultImageUrl: {
            type: String,
            default: null,
        },
        processingTime: {
            type: Number,
            default: null,
        },
    },
}, {
    timestamps: true,
});
tryOnSessionSchema.index({ userId: 1, createdAt: -1 });
tryOnSessionSchema.index({ sessionId: 1 }, { unique: true });
tryOnSessionSchema.index({ status: 1 });
tryOnSessionSchema.virtual('processingDuration').get(function () {
    if (this.processingStartedAt && this.processingCompletedAt) {
        return this.processingCompletedAt.getTime() - this.processingStartedAt.getTime();
    }
    return null;
});
exports.TryOnSession = mongoose_1.default.model('TryOnSession', tryOnSessionSchema);
//# sourceMappingURL=TryOnSession.js.map