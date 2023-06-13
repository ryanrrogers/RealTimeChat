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
exports.createChat = void 0;
const chat_1 = __importDefault(require("../models/chat"));
function createChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _users } = req.body;
            const dateCreated = Date.now();
            const chat = new chat_1.default({ _users, dateCreated });
            chat.save()
                .then((savedChat) => {
                res.status(201).json(savedChat);
            })
                .catch((error) => {
                res.status(500).json({ error: `Internal server error: ${error}` });
            });
        }
        catch (error) { }
    });
}
exports.createChat = createChat;
