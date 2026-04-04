const { WebSocketServer, WebSocket } = require('ws');
const DB = require('./database');

const authCookieName = 'token';
const userSockets = new Map();
let socketServer;

