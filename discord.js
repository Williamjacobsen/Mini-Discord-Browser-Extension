const Request = require("request");
const config = require("./config.json");

const AUTHORIZATION = config["user"]["Authorization"];

class discord_api {
  constructor(AUTHORIZATION) {
    this.token = AUTHORIZATION;
  }
  friends() {
    Request.get(
      "https://discordapp.com/api/v9/users/@me/relationships",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token,
        },
      },
      function (err, res, body) {
        if (err) {
          console.err(err);
        }
        console.log(JSON.parse(body));
      }
    );
  }
}

//new discord_api(AUTHORIZATION).friends();
module.exports = discord_api;
