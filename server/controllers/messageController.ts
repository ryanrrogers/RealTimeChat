import {Request, Response} from "express";
import Message from "../models/message";
import mongoose from "mongoose";

export async function createMessage(req: Request, res: Response) {
    try {
        let { _user, _chat, body } = req.body;
        const dateCreated = Date.now();

        const message = new Message({_user, _chat, body, dateCreated});

        message.save()
            .then((savedMessage) => {
                res.status(201).json(savedMessage);
            })
            .catch((error) => {
                res.status(500).json({error: `Internal server error: ${error}`});
            });
    } catch (error) {
        res.status(400).json({error: `Bad Request: ${error}`});
    }
}

export async function getMessagesForChat(req: Request, res: Response) {
    try{
        let { _chat } = req.body;
        const chat = new mongoose.Types.ObjectId(_chat);

        await Message.find({ _chat: { $in: [chat] } })
            .then((messages) => {
                res.status(200).json(messages);
            })
            .catch((error) => {
                res.status(404).json({ error: `Could not find chat or messages: ${error}` });
            });
    } catch(error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
}

export async function updateMessage(req: Request, res: Response) {
    try{
        let { _message, body } = req.body;
        const message = new mongoose.Types.ObjectId(_message);

        await Message.findByIdAndUpdate(
            message,
            { body: body },
            { new: true }
        )
            .then((updatedMessage) => {
                res.status(200).json(updatedMessage);
            })
            .catch((error) => {
                res.status(404).json({ error: `Could not find message: ${error}` });
            });
    } catch(error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
}

export async function deleteMessage(req: Request, res: Response) {
    try {
        let { _message } = req.body;
        const message = new mongoose.Types.ObjectId(_message);

        await Message.findByIdAndRemove(message)
            .then(() => {
                res.status(200).json({ message: "Message deleted." });
            })
            .catch((error) => {
                res.status(404).json({ message: `Could not find message: ${error}` });
            })
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
}