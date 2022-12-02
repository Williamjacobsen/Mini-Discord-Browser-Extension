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

const Payload = {
  op: 2,
  d: {
    token: AUTHORIZATION,
    intents: 513,
    properties: {
      os: "linux",
      browser: "Firefox",
      device: "pc",
    },
  },
};

function heartbeat(ms) {
  return setInterval(() => {
    ws.send(JSON.stringify({ op: 1, d: null }));
  }, ms);
}

ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");

ws.addEventListener("open", (event) => {
  ws.send(JSON.stringify(Payload));
});

ws.addEventListener("message", (event) => {
  if (JSON.parse(event.data)["op"] == 10) {
    const heartbeat_interval = JSON.parse(event.data)["d"][
      "heartbeat_interval"
    ];
    ws.send(JSON.stringify(Payload));
    heartbeat(heartbeat_interval);
  }
  console.log(JSON.parse(event.data));
  //if (JSON.parse(event.data)["t"] == "MESSAGE_CREATED") {}
});

/*
const Payload = {
  content: "sus",
};

Request.post(
  URL,
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTHORIZATION,
    },
    body: JSON.stringify(Payload),
  },
  function (err, res, body) {
    console.log(err);
    console.log(body);
  }
);
*/
