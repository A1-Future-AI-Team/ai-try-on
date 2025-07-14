"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("@/controllers/uploadController");
const auth_1 = require("@/middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.post('/', uploadController_1.upload, uploadController_1.uploadImageHandler);
router.get('/', uploadController_1.getUserImages);
router.get('/:id', uploadController_1.getImageById);
router.delete('/:id', uploadController_1.deleteImage);
exports.default = router;
//# sourceMappingURL=upload.js.map