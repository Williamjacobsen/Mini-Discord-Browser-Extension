console.clear();

const Request = require("request");
const WebSocket = require("ws");
const config = require("./config.json");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    crimson: "\x1b[38m",
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    crimson: "\x1b[48m",
  },
};

function setColor(color, msg) {
  process.stdout.write(color);
  console.log(msg);
  process.stdout.write(colors.reset);
}

/* Resources
  https://discord.com/developers/docs/topics/gateway
  https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket 
*/

// const ID = "1047213484309483582";

// typing = https://discord.com/api/v9/channels/${ID}/typing
// messages = https://discordapp.com/api/v9/channels/${ID}/messages
// https://discordapp.com/api/v9/users/@me/relationships

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

let activity = "BOT";

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
          name: activity,
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

ws.addEventListener("open", (event) => {
  ws.send(JSON.stringify(Payload));
});

ws.on("message", (event) => {
  event = JSON.parse(event);
  if (event["op"] == 11) {
    setColor(colors.fg.yellow, "Heartbeat Received...");
  } else if (event["t"] == "MESSAGE_CREATE") {
    console.log(
      `${event["d"]["author"]["username"]}: ${event["d"]["content"]} - ${event["d"]["timestamp"]} - msg-id: ${event["d"]["id"]}`
    );
  } else if (event["t"] == "MESSAGE_UPDATE") {
    console.log(
      `${event["d"]["author"]["username"]}: ${event["d"]["content"]} - ${event["d"]["timestamp"]} - msg-id: ${event["d"]["id"]}`
    );
  } else if (event["op"] == 10) {
    setColor(colors.fg.green, "Initializing...");
    console.log(`Event OP: ${event["op"]}`);
    heartbeat(event["d"]["heartbeat_interval"]);
  } else if (event["t"] == "READY" && event["op"] == 0) {
    setColor(colors.fg.green, "Connection Ready...");
    console.log(`Event OP: ${event["op"]}, Event T: ${event["t"]}`);
  } else if (event["t"] == "SESSIONS_REPLACE" && event["op"] == 0) {
    setColor(colors.fg.green, "Connection Stable...");
    console.log(
      `Event OP: ${event["op"]}, Event T: ${event["t"]}, Event D - Status: ${event["d"][0]["status"]}, Event S: ${event["s"]}`
    );
  } else {
    console.log(event);
  }
});
