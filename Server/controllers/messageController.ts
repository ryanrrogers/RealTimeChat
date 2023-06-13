import {Request, Response} from "express";
import Message from "../models/message";

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