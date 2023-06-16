import express from 'express';
import dotenv from 'dotenv';
import {createUser, deactivateUser, getUser, updateUser} from "./controllers/userController";
import {addUserToChat, createChat, findChatById, findChatsForUser, removeUserFromChat} from "./controllers/chatController";
import {authenticate, authenticateToken} from "./controllers/authController";
import mongoose from "mongoose";
import {createMessage} from "./controllers/messageController";

// Declare routes
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';

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

    app.use('/api/users', userRoutes);
    app.use('/api/chats', chatRoutes);
    app.use('/api/messages', messageRoutes);

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