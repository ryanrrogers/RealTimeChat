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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userController_1 = require("./controllers/userController");
const chatController_1 = require("./controllers/chatController");
const authController_1 = require("./controllers/authController");
const mongoose_1 = __importDefault(require("mongoose"));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        const app = (0, express_1.default)();
        const port = process.env.PORT;
        const dbUrl = process.env.DB_CONNECTION;
        if (dbUrl === undefined) {
            throw new Error('Cannot find DB string!');
        }
        yield mongoose_1.default.connect(dbUrl);
        app.use(express_1.default.json());
        app.post('/api/users/post', userController_1.createUser);
        app.get('/api/users/get/:displayName?', authController_1.authenticateToken, userController_1.getUser);
        app.put('/api/users/put/:displayName', authController_1.authenticateToken, userController_1.updateUser);
        app.put('/api/users/deactivate/:displayName', authController_1.authenticateToken, userController_1.deactivateUser);
        app.post('/api/chats/post', authController_1.authenticateToken, chatController_1.createChat);
        app.post('/api/authenticate', authController_1.authenticate);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    });
}
startServer()
    .then(() => {
    console.log('Server is running successfully');
})
    .catch((error) => {
    console.error('Error starting the server: ', error);
    process.exit(1);
});
