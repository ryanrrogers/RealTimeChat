"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    displayName: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
