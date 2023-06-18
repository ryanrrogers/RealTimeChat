"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const messageController_1 = require("../controllers/messageController");
const router = express_1.default.Router();
router.post('/post', authController_1.authenticateToken, messageController_1.createMessage);
router.get('/get', authController_1.authenticateToken, messageController_1.getMessagesForChat);
router.put('/update', authController_1.authenticateToken, messageController_1.updateMessage);
router.delete('/delete', authController_1.authenticateToken, messageController_1.deleteMessage);
exports.default = router;
