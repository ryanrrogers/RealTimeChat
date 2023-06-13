import {Request, Response} from 'express';
import User from "../models/user";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response) {
    try {
        let { displayName, firstName, lastName, email, password } = req.body;
        const dateCreated = Date.now();
        const saltRounds = 10;

        displayName = displayName.toLowerCase();

        password = await bcrypt.hash(password, saltRounds);

        const user = new User({displayName, firstName, lastName, email, password, dateCreated});

        user.save()
            .then((savedUser) => {
                res.status(201).json(savedUser);
            })
            .catch((error) => {
                res.status(500).json({error: `Internal server error: ${error}`});
            });
    } catch (error) {
        res.status(400).json({error: `Bad Request: ${error}`});
    }
}

export async function getUser(req: Request, res: Response) {
    let displayName = req.params.displayName;
    if (displayName) {
        displayName = displayName.toLowerCase();
        User.findOne({ displayName })
            .then((user) => {
                res.status(200).json(user);
            })
            .catch((error) => {
                res.status(500).json({error: `Internal server error: ${error}`});
            });
    } else {
        User.find({})
            .then((users) => {
                res.status(200).json(users);
            })
            .catch((error) => {
                res.status(500).json({error: `Internal server error: ${error}`});
            });
    }
}

export async function updateUser(req: Request, res: Response) {
    const displayName = req.params.displayName.toLowerCase();
    let { firstName, lastName, email, password } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({ displayName }, { firstName, lastName, email, password }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch(error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
}

export async function deactivateUser(req: Request, res: Response) {
    const displayName = req.params.displayName.toLowerCase();
    const isActive = false;

    try {
        const updatedUser = await User.findOneAndUpdate({ displayName }, { isActive }, { new: true });

        if (!updateUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
}