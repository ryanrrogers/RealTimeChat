"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const chatController_1 = require("../controllers/chatController");
const router = express_1.default.Router();
router.post('/post', authController_1.authenticateToken, chatController_1.createChat);
router.get('/findChatById', authController_1.authenticateToken, chatController_1.findChatById);
router.get('/findChatsForUser', authController_1.authenticateToken, chatController_1.findChatsForUser);
router.put('/addUser', authController_1.authenticateToken, chatController_1.addUserToChat);
router.put('/removeUser', authController_1.authenticateToken, chatController_1.removeUserFromChat);
exports.default = router;
