require('dotenv').config();
var assert = require('assert');
var fs = require('fs');

var MongoClient = require('mongodb').MongoClient

var url = process.env.MONGO_URL;
var database = process.env.MONGO_DB_NAME;
var queryChannels;
queryChannels = new Promise((resolve, reject) => {MongoClient.connect(url, { useNewUrlParser:true, useUnifiedTopology:true },
                            function(err, client) {
      assert.equal(null, err);
      collection = client.db(database).collection('chatLog');
      collection.aggregate([
          {
              $lookup:{
                  from: "user",
                  localField: "authorID",
                  foreignField: "_id",
                  as: "user_info"
              }
          },
          {   $unwind:"$user_info" },

          {
            $lookup:{
                from: "textChannel",
                localField: "channelID",
                foreignField: "_id",
                as: "channel_info"
            }
          },
          {   $unwind:"$channel_info" },
          {
              $project:{
                  _id : 1,
                  content : 1,
                  date : 1,
                  channelID:1,
                  nickname : "$user_info.nickname",
                  channel: "$channel_info.name"
              }
          }
      ]).toArray(function (err, result) {
      assert.equal(null, err);
      resolve(result)
      client.close();
    });
  })
}).then(result => {
  var writeStream = fs.createWriteStream('./data/archive.csv');
  writeStream.write("ChannelID,Channel,Time,Author,Message\n",'UTF8');
    result.forEach((rowInChatlog) =>{
      var messageWithoutQuotes = rowInChatlog.content.replaceAll("\"", "\'\'");
      var dateMonth = (rowInChatlog.date.getMonth()+1).toString()
      var dateDay = rowInChatlog.date.getDate().toString()
      if(parseInt(dateDay)<10){
        dateDay = "0"+dateDay
      }
      if(parseInt(dateMonth)<10){
        dateMonth = "0"+dateMonth
      }
      var dateFormatted = rowInChatlog.date.getFullYear()+"-"+dateMonth+"-"+dateDay+" "
    + rowInChatlog.date.getHours()+":"+rowInChatlog.date.getMinutes()+":"+rowInChatlog.date.getSeconds()
      writeStream.write(rowInChatlog.channelID +","+rowInChatlog.channel+","+dateFormatted+","+rowInChatlog.nickname+",\""+messageWithoutQuotes+"\"\n",'UTF8');
    })
    writeStream.end()
  });
