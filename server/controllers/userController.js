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
exports.deactivateUser = exports.updateUser = exports.getUser = exports.createUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { displayName, firstName, lastName, email, password } = req.body;
            const dateCreated = Date.now();
            const saltRounds = 10;
            displayName = displayName.toLowerCase();
            password = yield bcrypt_1.default.hash(password, saltRounds);
            const user = new user_1.default({ displayName, firstName, lastName, email, password, dateCreated });
            user.save()
                .then((savedUser) => {
                res.status(201).json(savedUser);
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
exports.createUser = createUser;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let displayName = req.params.displayName;
        if (displayName) {
            displayName = displayName.toLowerCase();
            user_1.default.findOne({ displayName })
                .then((user) => {
                res.status(200).json(user);
            })
                .catch((error) => {
                res.status(500).json({ error: `Internal server error: ${error}` });
            });
        }
        else {
            user_1.default.find({})
                .then((users) => {
                res.status(200).json(users);
            })
                .catch((error) => {
                res.status(500).json({ error: `Internal server error: ${error}` });
            });
        }
    });
}
exports.getUser = getUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const displayName = req.params.displayName.toLowerCase();
        let { firstName, lastName, email, password } = req.body;
        try {
            const updatedUser = yield user_1.default.findOneAndUpdate({ displayName }, { firstName, lastName, email, password }, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(updatedUser);
        }
        catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    });
}
exports.updateUser = updateUser;
function deactivateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const displayName = req.params.displayName.toLowerCase();
        const isActive = false;
        try {
            const updatedUser = yield user_1.default.findOneAndUpdate({ displayName }, { isActive }, { new: true });
            if (!updateUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(updatedUser);
        }
        catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    });
}
exports.deactivateUser = deactivateUser;
