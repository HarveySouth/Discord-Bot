require('dotenv').config();
var assert = require('assert');


const MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_URL;
var database = process.env.MONGO_DB_NAME;

MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  console.log("Connected successfully to the mongoDB Server");
  database.close();
});
