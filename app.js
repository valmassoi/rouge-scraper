const figlet = require("figlet");

const {checkRouge} = require("./scrape");

const app = () => {
  console.log(figlet.textSync("Rouge", { font: "isometric3" }));
  checkRouge()
  setInterval(checkRouge, 60000);
};

app();
