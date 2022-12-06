// to look at => https://github.com/PasinduDushan/Discord-Gateway-Example/blob/main/index.js

const Request = require("request");
const WebSocket = require("ws");
const fs = require("fs");
const config = require("./config.json");

/* Resources
  https://discord.com/developers/docs/topics/gateway
  https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket 
*/

const ID = "1047213484309483582";

// typing = https://discord.com/api/v9/channels/${ID}/typing
// messages = https://discordapp.com/api/v9/channels/${ID}/messages
// const URL = `https://discordapp.com/api/v9/channels/${ID}/messages`;

/*
    Create /config.json
    Write authorization key, like shown below...
    
    {
        "user": {
            "Authorization": "your_authorization_key"
        }
    }
*/
const AUTHORIZATION = config["user"]["Authorization"];

let interval = 0;

const Payload = {
  op: 2,
  d: {
    token: AUTHORIZATION,
    intents: 131071,
    properties: {
      $os: "linux",
      $browser: "chrome",
      $device: "chrome",
    },
    presence: {
      // omfg, the docs didn't mention this,
      // neither did tutorials,
      // but it fix it...
      // after 8 fucking hours :(
      activities: [
        {
          name: "Cards Against Humanity",
          type: 0,
        },
      ],
      status: "dnd",
      since: 91879201,
      afk: false,
    },
  },
};

const heartbeat = (ms) => {
  // had a bug for 8 hours, it should be a method not a function... Plz kill me...
  return setInterval(() => {
    ws.send(JSON.stringify({ op: 1, d: null }));
  }, ms);
};

ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");

/*
  Explain, future me...
*/

ws.addEventListener("open", (event) => {
  ws.send(JSON.stringify(Payload));
});

ws.on("message", function incoming(event) {
  event = JSON.parse(event);
  console.log(event);
  if (event["op"] == 10) {
    interval = heartbeat(event["d"]["heartbeat_interval"]);
  }
});
