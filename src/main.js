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
        // if(channelInServer.name == "pictures"){
        //   archive(channelInServer);
        // }
      }
    });
  });
});

async function archive(channel) {

    const returnArray = [];
    let finalMessageID;

    do{
        const options = { limit: 100 };
        if (finalMessageID) {
            options.before = finalMessageID;
        }
        var messageCollection = await channel.messages.fetch(options);
        messageCollection.forEach((messageInServer) => {
            attachmentMessage = " "
            // if(messageInServer.attachments.first() != null){
            //   var attachmentMessage =" " + messageInServer.attachments.first().url;
            // }
            //
            // var convertToReadable = "" + messageInServer.cleanContent + attachmentMessage
            // returnArray.push(convertToReadable)
        });
        if(messageCollection.last()){
          finalMessageID = messageCollection.last().id;
        }
        console.log("Found " + messageCollection.size + " New Messages.");
    }while(messageCollection.size == 100)

    // returnArray.forEach((messageInServer) => {//prints all messages that were converted to readable
    //   console.log(messageInServer)
    // });
}


//const dbScript = require('./databaseInteraction');
