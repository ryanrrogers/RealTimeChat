"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromChat = exports.addUserToChat = exports.findChatsForUser = exports.findChatById = exports.createChat = void 0;
const chat_1 = __importDefault(require("../models/chat"));
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
function createChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { _users } = req.body;
            const users = yield user_1.default.find({ _id: { $in: _users } });
            const activeUsers = users.filter((user) => user.isActive === true);
            const activeObjectIDs = activeUsers.map((user) => user._id.toString());
            const filteredUsers = _users.filter((id) => activeObjectIDs.includes(id));
            const dateCreated = Date.now();
            const chat = new chat_1.default({ _users: filteredUsers, dateCreated });
            yield chat.save();
            res.status(201).json(chat);
        }
        catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    });
}
exports.createChat = createChat;
function findChatById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { _chat } = req.body;
        try {
            yield chat_1.default.findById(_chat)
                .then((chat) => {
                res.status(200).json(chat);
            })
                .catch((error) => {
                res.status(404).json({ error: `Could not find chat: ${error}` });
            });
        }
        catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    });
}
exports.findChatById = findChatById;
function findChatsForUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { _user } = req.body;
        const user = new mongoose_1.default.Types.ObjectId(_user);
        try {
            yield chat_1.default.find({ _users: { $in: [user] } })
                .then((chats) => {
                res.status(200).json(chats);
            })
                .catch((error) => {
                res.status(404).json({ error: `Could not find chat(s): ${error}` });
            });
        }
        catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    });
}
exports.findChatsForUser = findChatsForUser;
function addUserToChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { _user, _chat } = req.body;
        const user = new mongoose_1.default.Types.ObjectId(_user);
        try {
            yield chat_1.default.findByIdAndUpdate(_chat, { $push: { _users: user } }, { new: true })
                .then((updatedChat) => {
                res.status(200).json(updatedChat);
            })
                .catch((error) => {
                res.status(404).json({ error: `Could not find chat or user: ${error}` });
            });
        }
        catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    });
}
exports.addUserToChat = addUserToChat;
function removeUserFromChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { _user, _chat } = req.body;
        const user = new mongoose_1.default.Types.ObjectId(_user);
        try {
            yield chat_1.default.findByIdAndUpdate(_chat, { $pull: { _users: user } }, { new: true })
                .then((updatedChat) => {
                res.status(200).json(updatedChat);
            })
                .catch((error) => {
                res.status(404).json({ error: `Could not find chat or user: ${error}` });
            });
        }
        catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    });
}
exports.removeUserFromChat = removeUserFromChat;
