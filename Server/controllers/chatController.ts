import { Request, Response } from 'express';
import Chat from '../models/chat';
import User from '../models/user';
import mongoose from 'mongoose';

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

export async function findChatById(req: Request, res: Response) {
  let { _chat } = req.body;

  try {
    await Chat.findById(_chat)
      .then((chat) => {
        res.status(200).json(chat);
      })
      .catch((error) => {
        res.status(404).json({ error: `Could not find chat: ${error}` });
      });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
}

export async function findChatsForUser(req: Request, res: Response) {
  let { _user } = req.body;
  const user = new mongoose.Types.ObjectId(_user);

  try {
    await Chat.find({ _users: { $in: [user] } })
      .then((chats) => {
        res.status(200).json(chats);
      })
      .catch((error) => {
        res.status(404).json({ error: `Could not find chat(s): ${error}` });
      });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
}

export async function addUserToChat(req: Request, res: Response) {
  const { _user, _chat } = req.body;
  const user = new mongoose.Types.ObjectId(_user);
  try {
    await Chat.findByIdAndUpdate(
      _chat,
      { $push: { _users: user } },
      { new: true },
    )
      .then((updatedChat) => {
        res.status(200).json(updatedChat);
      })
      .catch((error) => {
        res.status(404).json({ error: `Could not find chat or user: ${error}` });
      });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
}

export async function removeUserFromChat(req: Request, res: Response) {
  const { _user, _chat } = req.body;
  const user = new mongoose.Types.ObjectId(_user);
  try {
    await Chat.findByIdAndUpdate(
      _chat,
      { $pull: { _users: user } },
      { new: true },
    )
      .then((updatedChat) => {
        res.status(200).json(updatedChat);
      })
      .catch((error) => {
        res.status(404).json({ error: `Could not find chat or user: ${error}` });
      });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
}