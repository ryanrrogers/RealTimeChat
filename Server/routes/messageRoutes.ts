import express from "express";
import { authenticateToken } from "../controllers/authController";
import { createMessage } from "../controllers/messageController";

const router = express.Router();

router.post('/post', authenticateToken, createMessage);

export default router;