import {Request, Response} from 'express';
import Chat from "../models/chat";

export async function createChat(req: Request, res: Response) {
    try {
        const { _users } = req.body;

        const dateCreated = Date.now();

        const chat = new Chat({ _users, dateCreated });

        chat.save()
            .then((savedChat) => {
                res.status(201).json(savedChat);
            })
            .catch((error) => {
                res.status(500).json({ error: `Internal server error: ${error}` });
            })

    } catch (error) {}
}