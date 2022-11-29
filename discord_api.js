const Request = require("request");
const fs = require("fs");
const config = require("./config.json");

const ID = "681529308283535398";

const URL = `https://discordapp.com/api/v9/channels/${ID}/messages`;

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
