const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const cors = require('cors');

const port = process.argv.length > 2 ? process.argv[2] : 3000;
const authCookieName = 'token';

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

const users = {};

app.post('/user', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ msg: 'username and password required' });
  }

  if (users[username]) {
    return res.status(409).send({ msg: 'Existing user' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const authToken = uuid.v4();

  users[username] = {
    username,
    passwordHash,
    authToken,
    items: [],
    schedule: [],
  };

  setAuthCookie(res, authToken);

  return res.status(201).send({ username });
});

app.post('/session', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ msg: 'username and password required' });
  }

  const user = users[username];
  if (!user) {
    return res.status(401).send({ msg: 'User not found' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).send({ msg: 'Incorrect password' });
  }

  const authToken = uuid.v4();
  user.authToken = authToken;
  setAuthCookie(res, authToken);

  return res.status(200).send({
    username: user.username,
    items: user.items,
    schedule: user.schedule,
  });
});

app.delete('/session', (req, res) => {
  const user = getUser('authToken', req.cookies?.[authCookieName]);
  if (user) {
    delete user.authToken;
  }

  res.clearCookie(authCookieName);

  return res.status(204).send();
});

app.post('/item', (req, res) => {
  const user = getUser('authToken', req.cookies?.[authCookieName]);
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

  user.items.push(newItem);
  return res.status(201).send({ items: user.items });
});

app.delete('/item/:id', (req, res) => {
  const user = getUser('authToken', req.cookies?.[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ msg: 'Item id is required' });
  }

  const itemIndex = user.items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).send({ msg: 'Item not found' });
  }

  user.items.splice(itemIndex, 1);
  return res.status(200).send({ items: user.items });
});

app.post('/schedule', (req, res) => {
  const user = getUser('authToken', req.cookies?.[authCookieName]);
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

  const existingIndex = user.schedule.findIndex((entry) => entry.id === newScheduleItem.id);
  if (existingIndex !== -1) {
    user.schedule[existingIndex] = newScheduleItem;
  } else {
    user.schedule.push(newScheduleItem);
  }

  return res.status(201).send({ schedule: user.schedule });
});

app.delete('/schedule/:id', (req, res) => {
  const user = getUser('authToken', req.cookies?.[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ msg: 'Schedule id is required' });
  }

  const scheduleIndex = user.schedule.findIndex((entry) => entry.id === id);
  if (scheduleIndex === -1) {
    return res.status(404).send({ msg: 'Schedule item not found' });
  }

  user.schedule.splice(scheduleIndex, 1);
  return res.status(200).send({ schedule: user.schedule });
});


function getUser(field, value) {
  if (!value) return null;

  return Object.values(users).find((user) => user[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: false, // make true for production
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.get('/', (_req, res) => {
  res.send({ msg: 'service functional' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
