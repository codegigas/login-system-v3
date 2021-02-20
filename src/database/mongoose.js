const config = require("../../config.js");
const mongoose = require("mongoose");

// Config
const uri = config.DB_CONNECTION_URL;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}
// Private Variables
var db = null;

const connect = async () => {
  try {
    await mongoose.connect(uri, options);
    db = mongoose.connection;
    return Promise.resolve();
  } catch (error) {
    return Promise.reject("Mongoose: Error on initial connection");
  }
}

const getDb = async () => {
  if (db) {
    return Promise.resolve(db);
  } else {
    return Promise.reject("There is no database instance");
  }
}

mongoose.connection.on('error', (error) => {
  console.log("Mongoose: Error after initial connection");
  console.log(error);
});

module.exports = {
  connect: connect,
  getDb: getDb
}