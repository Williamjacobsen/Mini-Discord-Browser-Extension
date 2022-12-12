const config = require("./config.json");
const Discord = require("./discord.js");

const AUTHORIZATION = config["user"]["Authorization"];

const discord = new Discord(AUTHORIZATION);
discord.friends();
