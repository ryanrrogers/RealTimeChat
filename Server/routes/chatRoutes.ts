import express from "express";
import { authenticateToken } from "../controllers/authController";
import { addUserToChat, createChat, findChatById, findChatsForUser, removeUserFromChat } from "../controllers/chatController";

const router = express.Router();

    router.post('/post', authenticateToken, createChat);
    router.get('/findChatById', authenticateToken, findChatById);
    router.get('/findChatsForUser', authenticateToken, findChatsForUser);
    router.put('/addUser', authenticateToken, addUserToChat);
    router.put('/removeUser', authenticateToken, removeUserFromChat);

export default router;