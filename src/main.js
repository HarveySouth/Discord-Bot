require('dotenv').config();

const Discord = require('discord.js')
const client = new Discord.Client()

client.login(process.env.CONNECT_TOKEN_DISCORD);

const db = require('./databaseInteraction');

client.on('ready', () =>{
  console.log("Connection Successful");
  client.guilds.cache.forEach((connectedDiscordServer) => {
    console.log("Connected to server: " +connectedDiscordServer.name);
    connectedDiscordServer.channels.cache.forEach((channelInServer) => {
      console.log("Channel found: " + channelInServer.name);
      if(channelInServer.isText()){
        //archive(channelInServer); //uncomment here to archive all connected channels
      }
    });
  });
});

async function archive(channel) {
  //put guild and channel in db if does not exists
  //guild
  guildID = channel.guild.id;
  data = {_id:channel.guild.id , name:channel.guild.name};
  db.dbInsertIfNotExists("server",data);
  //channel
  channelID = channel.id;
  data = {_id:channel.id, name:channel.name, server_id:channel.guild.id};
  db.dbInsertIfNotExists("textChannel",data);
  //loop through all messages inserting users and messages
  let finalMessageID;
  var foundUsers = [];
  do{
      const options = { limit: 100 };
      if (finalMessageID) {
          options.before = finalMessageID;
      }
      var messageCollection = await channel.messages.fetch(options);
      messageCollection.forEach((messageInServer) => {
        if(!(foundUsers.includes(messageInServer.author.id))){
            var nickname = messageInServer.author.username +"#"+messageInServer.author.discriminator;
            data = {_id:messageInServer.author.id, nickname:nickname};
            dataPush = {server_id:guildID}
            db.dbInsertUserAndPushGuildIfNotExists("user",data,dataPush);
            foundUsers.push(messageInServer.author.id);
        }

        var date = new Date(messageInServer.createdTimestamp);
        attachmentMessage = "";
        if(messageInServer.attachments.first() != null){
          var attachmentMessage =" " + messageInServer.attachments.first().url;
        }
        messageContentFormatted = messageInServer.cleanContent + attachmentMessage;
        data = {_id:messageInServer.id, content:messageContentFormatted,authorID:messageInServer.author.id,channelID:channelID,date:date};
        db.dbInsertIfNotExists("chatLog",data);
      });
      if(messageCollection.last()){
        finalMessageID = messageCollection.last().id;
      }
      console.log("Found " + messageCollection.size + " New Messages in "+channel.name+".");
  }while(messageCollection.size == 100)
}
