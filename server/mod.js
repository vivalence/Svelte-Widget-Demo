import { startServer } from './server.js';

console.log('Starting server on http://localhost:3000');

const server = await startServer(3000);

console.log('Server shutdown.');
