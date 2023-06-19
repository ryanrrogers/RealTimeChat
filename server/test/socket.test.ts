import { Server } from 'socket.io';
import { startServer } from '../main'; // Import the server code

describe('Socket connection test', () => {
  let socket: any;
  let server: any;

  beforeAll(async () => {
    server = await startServer(); // Start the server and get the server instance
    const io = new Server(server);
    io.on('connection', (newSocket: any) => {
      socket = newSocket; // Save the socket instance for testing
    });
  });

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