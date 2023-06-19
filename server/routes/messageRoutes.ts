import express from "express";
import { authenticateToken } from "../controllers/authController";
import { createMessage, deleteMessage, getMessagesForChat, updateMessage } from "../controllers/messageController";

const router = express.Router();

router.post('/post', authenticateToken, createMessage);
router.get('/get', authenticateToken, getMessagesForChat);
router.put('/update', authenticateToken, updateMessage);
router.delete('/delete', authenticateToken, deleteMessage);

export default router;