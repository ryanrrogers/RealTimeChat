import express from 'express';
import dotenv from 'dotenv';
import {createUser, deactivateUser, getUser, updateUser} from "./controllers/userController";
import {createChat} from "./controllers/chatController";
import {authenticate, authenticateToken} from "./controllers/authController";
import mongoose from "mongoose";

async function startServer() {

    dotenv.config();

    const app = express();
    const port = process.env.PORT;
    const dbUrl = process.env.DB_CONNECTION;

    if (dbUrl === undefined) {
        throw new Error('Cannot find DB string!');
    }

    await mongoose.connect(dbUrl);

    app.use(express.json());

    app.post('/api/users/post', createUser);
    app.get('/api/users/get/:displayName?', authenticateToken, getUser);
    app.put('/api/users/put/:displayName', authenticateToken, updateUser);
    app.put('/api/users/deactivate/:displayName', authenticateToken, deactivateUser);

    app.post('/api/chats/post', authenticateToken, createChat);

    app.post('/api/authenticate', authenticate);

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

startServer()
    .then(() => {
        console.log('Server is running successfully');
    })
    .catch((error) => {
        console.error('Error starting the server: ', error);
        process.exit(1);
    });