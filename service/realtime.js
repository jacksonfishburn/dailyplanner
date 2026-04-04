const { WebSocketServer, WebSocket } = require('ws');
const DB = require('./database');

const authCookieName = 'token';
const userSockets = new Map();
let socketServer;

async function attachRealtime(httpServer) {
	socketServer = new WebSocketServer({ server: httpServer });

	socketServer.on('connection', async (socket, req) => {
		socket.isAlive = true;

		const token = getTokenFromRequest(req);
		if (!token) {
			socket.close();
			return;
		}

		const user = await DB.getUserByToken(token);
		if (!user) {
			socket.close();
			return;
		}

		socket.username = user.username;

		if (!userSockets.has(socket.username)) {
			userSockets.set(socket.username, new Set());
		}
		userSockets.get(socket.username).add(socket);

		socket.on('pong', () => {
			socket.isAlive = true;
		});

		socket.on('close', () => {
			removeSocket(socket.username, socket);
		});

		socket.on('error', () => {
			removeSocket(socket.username, socket);
		});
	});
}

function parseCookies(cookieHeader) {
	if (!cookieHeader) {
		return {};
	}

	return cookieHeader
		.split(';')
		.map((pair) => pair.trim())
		.filter(Boolean)
		.reduce((acc, pair) => {
			const [rawKey, ...rawValue] = pair.split('=');
			if (!rawKey) {
				return acc;
			}

			const key = decodeURIComponent(rawKey);
			const value = decodeURIComponent(rawValue.join('='));
			acc[key] = value;
			return acc;
		}, {});
}

function getTokenFromRequest(req) {
	const cookies = parseCookies(req?.headers?.cookie);
	return cookies[authCookieName];
}

function removeSocket(username, socket) {
	if (!username || !socket) {
		return;
	}

	const sockets = userSockets.get(username);
	if (!sockets) {
		return;
	}

	sockets.delete(socket);
	if (sockets.size === 0) {
		userSockets.delete(username);
	}
}