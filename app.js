const figlet = require("figlet");
const axios = require("axios");

require("dotenv").config();

const { checkRouge } = require("./scrape");

const app = () => {
  console.log(figlet.textSync("Rouge", { font: "Isometric3" }));
  const { SLACK_WEBHOOK_URL } = process.env;
  if (SLACK_WEBHOOK_URL) {
    axios.post(
      SLACK_WEBHOOK_URL,
      { text: "Rouge app started " + new Date() },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
  }
  checkRouge()
  setInterval(checkRouge, 60000);
};

app();
