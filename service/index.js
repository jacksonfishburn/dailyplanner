const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const cors = require('cors');
const DB = require('./database');
const http = require('http');
const { attachRealtime } = require('./realtime');

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const authCookieName = 'token';

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.post('/api/user', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ msg: 'username and password required' });
  }

  const existingUser = await DB.getUser(username);
  if (existingUser) {
    return res.status(409).send({ msg: 'Existing user' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const authToken = uuid.v4();

  const user = {
    username,
    passwordHash,
    authToken,
    items: [],
    schedule: [],
  };

  await DB.addUser(user);

  setAuthCookie(res, authToken);

  return res.status(201).send({ username });
});

app.post('/api/session', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ msg: 'username and password required' });
  }

  const user = await DB.getUser(username);
  if (!user) {
    return res.status(401).send({ msg: 'User not found' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).send({ msg: 'Incorrect password' });
  }

  const authToken = uuid.v4();
  user.authToken = authToken;
  await DB.updateUser(user);
  setAuthCookie(res, authToken);

  return res.status(200).send({
    username: user.username,
    items: user.items,
    schedule: user.schedule,
  });
});

app.delete('/api/session', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies?.[authCookieName]);
  if (user) {
    await DB.updateUserRemoveAuth(user);
  }

  res.clearCookie(authCookieName);

  return res.status(204).send();
});

app.post('/api/item', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies?.[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const { name, time, isRecurring } = req.body;
  if (!name || !Number.isFinite(time) || time <= 0 || typeof isRecurring !== 'boolean') {
    return res.status(400).send({ msg: 'Invalid item payload' });
  }

  const newItem = {
    id: uuid.v4(),
    name,
    time,
    isRecurring,
  };

  const items = await DB.addItem(user.username, newItem);
  return res.status(201).send({ items });
});

app.delete('/api/item/:id', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies?.[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ msg: 'Item id is required' });
  }

  const itemExists = user.items.findIndex((item) => item.id === id) !== -1;
  if (!itemExists) {
    return res.status(404).send({ msg: 'Item not found' });
  }

  const items = await DB.removeItem(user.username, id);
  return res.status(200).send({ items });
});

app.post('/api/schedule', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies?.[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const { id, name, time, isRecurring, startMin } = req.body;
  const hasValidId = id === undefined || (typeof id === 'string' && id.length > 0);
  if (
    !hasValidId ||
    !name ||
    !Number.isFinite(time) || time <= 0 ||
    typeof isRecurring !== 'boolean' ||
    !Number.isFinite(startMin) || startMin < 0
  ) {
    return res.status(400).send({ msg: 'Invalid schedule payload' });
  }

  const newScheduleItem = {
    id: id ?? uuid.v4(),
    name,
    time,
    isRecurring,
    startMin,
  };

  const schedule = await DB.upsertScheduleItem(user.username, newScheduleItem);
  return res.status(201).send({ schedule });
});

app.delete('/api/schedule/:id', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies?.[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ msg: 'Schedule id is required' });
  }

  const scheduleExists = user.schedule.findIndex((entry) => entry.id === id) !== -1;
  if (!scheduleExists) {
    return res.status(404).send({ msg: 'Schedule item not found' });
  }

  const schedule = await DB.removeScheduleItem(user.username, id);
  return res.status(200).send({ schedule });
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: false,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.get('/api', (_req, res) => {
  res.send({ msg: 'service functional' });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const server = http.createServer(app);
attachRealtime(server);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
