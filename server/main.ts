import express from 'express';
import dotenv from 'dotenv';
import { authenticate } from "./controllers/authController";
import mongoose from "mongoose";
import http from 'http';
import cors from 'cors';


// Declare routes
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import { Server } from 'socket.io';

async function startServer() {

    dotenv.config();

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);
    const port = process.env.PORT;
    const dbUrl = process.env.DB_CONNECTION;

    if (dbUrl === undefined) {
        throw new Error('Cannot find DB string!');
    }

    await mongoose.connect(dbUrl);

    app.use(
        cors({
            origin: 'http://localhost:3000'
        })
    );

    // socket event listeners
    io.on('connection', (socket) => {
        console.log('A user has connected');

        socket.on('disconnect', () => {
            console.log('A user has disconnected');
        });
    });

    app.use(express.json());

    app.use('/api/users', userRoutes);
    app.use('/api/chats', chatRoutes);
    app.use('/api/messages', messageRoutes);

    app.post('/api/authenticate', authenticate);

    server.listen(port, () => {
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

export { startServer };