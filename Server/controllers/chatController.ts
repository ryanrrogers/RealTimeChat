import { Request, Response } from 'express';
import Chat from '../models/chat';
import User from '../models/user';

export async function createChat(req: Request, res: Response) {
    try {
        let { _users } = req.body;

        const users = await User.find({ _id: { $in: _users } });

        const activeUsers = users.filter((user) => user.isActive === true);
        const activeObjectIDs = activeUsers.map((user) => user._id.toString());

        const filteredUsers = _users.filter((id: string) => activeObjectIDs.includes(id));

        const dateCreated = Date.now();

        const chat = new Chat({ _users: filteredUsers, dateCreated });

        await chat.save();

        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
}