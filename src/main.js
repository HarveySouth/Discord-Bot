require('dotenv').config();

const Discord = require('discord.js')
const client = new Discord.Client()

client.login(process.env.CONNECT_TOKEN_DISCORD);

client.on('ready', () =>{
  console.log("Connection Successful");
  client.guilds.cache.forEach((connectedDiscordServer) => {
    console.log("Connected to server: " +connectedDiscordServer.name);
  });


});


//const dbScript = require('./databaseInteraction');
