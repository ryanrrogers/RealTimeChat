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
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const main_1 = require("../main"); // Import the server code
describe('Socket connection test', () => {
    let socket;
    let server;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server = yield (0, main_1.startServer)(); // Start the server and get the server instance
        const io = new socket_io_1.Server(server);
        io.on('connection', (newSocket) => {
            socket = newSocket; // Save the socket instance for testing
        });
    }));
    afterAll((done) => {
        server.close(() => {
            done();
        }); // Close the server after all tests are done
    });
    test('User can connect and disconnect', (done) => {
        socket.on('connect', () => {
            // The user has connected
            expect(socket.connected).toBe(true);
            socket.on('disconnect', () => {
                // The user has disconnected
                expect(socket.connected).toBe(false);
                done();
            });
            socket.disconnect();
        });
    });
    // Write more tests for other socket events and scenarios
});
