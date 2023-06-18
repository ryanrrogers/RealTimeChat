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
exports.getMessagesForChat = exports.createMessage = void 0;
const message_1 = __importDefault(require("../models/message"));
function createMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { _user, _chat, body } = req.body;
            const dateCreated = Date.now();
            const message = new message_1.default({ _user, _chat, body, dateCreated });
            message.save()
                .then((savedMessage) => {
                res.status(201).json(savedMessage);
            })
                .catch((error) => {
                res.status(500).json({ error: `Internal server error: ${error}` });
            });
        }
        catch (error) {
            res.status(400).json({ error: `Bad Request: ${error}` });
        }
    });
}
exports.createMessage = createMessage;
function getMessagesForChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { _chat } = req.body;
            const chat = new mongoose.Types.ObjectId(_chat);
        }
        finally {
        }
    });
}
exports.getMessagesForChat = getMessagesForChat;
