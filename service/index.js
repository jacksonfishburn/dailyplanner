const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const port = process.argv.length > 2 ? process.argv[2] : 3000;
const authCookieName = 'token';

app.use(cookieParser());
app.use(express.json());

const users = {};

app.post('/user', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ msg: 'username and password required' });
  }

  if (users[username]) {
    return res.status(409).send({ msg: 'existing user' });
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
  const user = getUser('authToken', authCookieName);
  if (user) {
    delete user.authToken;
  }

  res.clearCookie(authCookieName);

  return res.status(204).send();
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
