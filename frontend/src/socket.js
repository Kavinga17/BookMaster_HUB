import { io } from 'socket.io-client';

// Connect to the backend WebSocket server
const socket = io('http://localhost:5001'); // Replace with your backend server URL if different
export default socket;
