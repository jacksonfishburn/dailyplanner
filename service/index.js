const express = require('express');
const app = express();

app.use(express.json());

const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.get('/', (_req, res) => {
  res.send({ msg: 'service functional' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
