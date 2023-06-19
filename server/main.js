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
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authController_1 = require("./controllers/authController");
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
// Declare routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const socket_io_1 = require("socket.io");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        const io = new socket_io_1.Server(server);
        const port = process.env.PORT;
        const dbUrl = process.env.DB_CONNECTION;
        if (dbUrl === undefined) {
            throw new Error('Cannot find DB string!');
        }
        yield mongoose_1.default.connect(dbUrl);
        app.use((0, cors_1.default)({
            origin: 'http://localhost:3000',
            methods: ['POST', 'GET', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));
        // socket event listeners
        io.on('connection', (socket) => {
            console.log('A user has connected');
            socket.on('disconnect', () => {
                console.log('A user has disconnected');
            });
        });
        app.use(express_1.default.json());
        app.use('/api/users', userRoutes_1.default);
        app.use('/api/chats', chatRoutes_1.default);
        app.use('/api/messages', messageRoutes_1.default);
        app.post('/api/authenticate', authController_1.authenticate);
        server.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    });
}
exports.startServer = startServer;
startServer()
    .then(() => {
    console.log('Server is running successfully');
})
    .catch((error) => {
    console.error('Error starting the server: ', error);
    process.exit(1);
});
