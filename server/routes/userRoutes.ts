import express from "express";
import { authenticateToken } from "../controllers/authController";
import { createUser, deactivateUser, getUser, updateUser } from "../controllers/userController";

const router = express.Router();

    router.post('/post', createUser);
    router.get('/get/:displayName?', authenticateToken, getUser);
    router.put('/put/:displayName', authenticateToken, updateUser);
    router.put('/deactivate/:displayName', authenticateToken, deactivateUser);

export default router;