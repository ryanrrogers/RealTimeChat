"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    _user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    _chat: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Chat'
    },
    body: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true
    }
});
const Message = (0, mongoose_1.model)('Message', messageSchema);
exports.default = Message;
