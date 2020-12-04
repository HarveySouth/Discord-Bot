require('dotenv').config();
var mysql = require('mysql');
var dbUser = process.env.DB_USERNAME_DISCORDBOT;
var dbPass = process.env.DB_PASS_DISCORDBOT;
var dbHost = process.env.DB_HOST_DISCORDBOT;

var connection = mysql.createConnection({
  host     : dbHost,
  user     : dbUser,
  password : dbPass,
});
