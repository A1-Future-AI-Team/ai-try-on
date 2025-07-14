"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryOnController_1 = require("@/controllers/tryOnController");
const auth_1 = require("@/middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.post('/', tryOnController_1.createTryOnSession);
router.get('/', tryOnController_1.getTryOnSessions);
router.get('/:sessionId', tryOnController_1.getTryOnSessionById);
router.put('/:sessionId/status', tryOnController_1.updateTryOnSessionStatus);
router.delete('/:sessionId', tryOnController_1.deleteTryOnSession);
router.get('/:sessionId/download', tryOnController_1.downloadResultImage);
router.get('/results/:filename', tryOnController_1.serveResultImage);
exports.default = router;
//# sourceMappingURL=tryOn.js.map