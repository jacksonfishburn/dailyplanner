const { WebSocketServer, WebSocket } = require('ws');
const DB = require('./database');

const authCookieName = 'token';
const userSockets = new Map();
let socketServer;

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

