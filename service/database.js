const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

const db = client.db('dailyplanner');
const userCollection = db.collection('user');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(username) {
  return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return userCollection.findOne({ authToken: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ username: user.username }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ username: user.username }, { $unset: { authToken: 1 } });
}

async function addItem(username, item) {
  await userCollection.updateOne({ username: username }, { $push: { items: item } });
  const updatedUser = await userCollection.findOne({ username: username });
  return updatedUser?.items || [];
}

async function removeItem(username, itemId) {
  await userCollection.updateOne({ username: username }, { $pull: { items: { id: itemId } } });
  const updatedUser = await userCollection.findOne({ username: username });
  return updatedUser?.items || [];
}

async function upsertScheduleItem(username, scheduleItem) {
  await userCollection.updateOne({ username: username }, { $pull: { schedule: { id: scheduleItem.id } } });
  await userCollection.updateOne({ username: username }, { $push: { schedule: scheduleItem } });
  const updatedUser = await userCollection.findOne({ username: username });
  return updatedUser?.schedule || [];
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  addItem,
  removeItem,
  upsertScheduleItem,
};

