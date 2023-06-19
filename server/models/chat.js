"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    _users: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: true,
        ref: 'User',
    },
    _messages: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Message'
    },
    dateCreated: {
        type: Date,
        required: true
    }
});
const Chat = (0, mongoose_1.model)('Chat', chatSchema);
exports.default = Chat;
