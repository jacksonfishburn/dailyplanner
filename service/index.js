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



function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: false, // change for production
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
