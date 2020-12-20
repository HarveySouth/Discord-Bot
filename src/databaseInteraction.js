require('dotenv').config();
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient

var url = process.env.MONGO_URL;
var database = process.env.MONGO_DB_NAME;

async function dbInsert(collection, query) {
  MongoClient.connect(url, { useNewUrlParser:true, useUnifiedTopology:true },
                            function(err, client) {
    const col = client.db(database).collection(collection);
    col.insertOne(query, function(err, result) {
      assert.equal(null, err);
      client.close();
    });
  });
}

async function dbInsertIfNotExists(collection, query) {
  MongoClient.connect(url, { useNewUrlParser:true, useUnifiedTopology:true },
                            function(err, client) {
    const col = client.db(database).collection(collection);
    if(!("_id" in query)){
      col.insertOne(query, function(err, result) {
        assert.equal(null, err);
        client.close();
      });
    }
    else{
      const updateQuery = {_id:query.id};
      delete query.id;
      const update = { $set: query};
      col.updateOne(query, update, { upsert: true }, function(err, result) {
        assert.equal(null, err);
        client.close();
      });

    }
  });
}

async function dbInsertUserAndPushGuildIfNotExists(collection, query, pushData) {
  MongoClient.connect(url, { useNewUrlParser:true, useUnifiedTopology:true },
                            function(err, client) {
    const col = client.db(database).collection(collection);
    if(!("_id" in query)){
      col.insertOne(query, function(err, result) {
        assert.equal(null, err);
        client.close();
      });
    }
    else{
      const updateQuery = {_id:query.id};
      delete query.id;
      const update = { $set: query};
      col.updateOne(query, update,{ $push: pushData }, { upsert: true }, function(err, result) {
        assert.equal(null, err);
        client.close();
      });

    }
  });
}

module.exports ={
        dbInsertIfNotExists,dbInsert,dbInsertUserAndPushGuildIfNotExists
    }
