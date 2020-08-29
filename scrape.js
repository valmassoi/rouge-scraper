const axios = require("axios");
const cheerio = require("cheerio");
const notifier = require("node-notifier");

require("colors")

const items = require('./items.consts');

const notify = (url, instockItems, image) => {
  const title = "Rouge";
  const subtitle = "Found Stock!!!";
  const message = instockItems.join(", ");

  notifier.notify({
    title,
    subtitle,
    message,
    icon: `./images/rouge.jpeg`,
    contentImage: `./images/${image}`,
    open: url,
    timeout: 1000000,
    sound: true,
  });

  const { SLACK_WEBHOOK_URL } = process.env;
  if (SLACK_WEBHOOK_URL) {
    axios.post(
      SLACK_WEBHOOK_URL,
      { text: `${title}: ${subtitle} ${message}\n\n${url}` },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
  }
};

const getRougeStock = (html, wantedItems) => {
  const $ = cheerio.load(html);
  const foundProducts = $(".grouped-item-row");
  if (!foundProducts || foundProducts.length === 0) {
    console.error("Error: Couldn't find any products parsing html");
  }
  
  const instockItems = [];
  foundProducts.each((i, elem) => {
    const itemName = $(elem).find(".item-name").text();
    const hasQtyInput = $(elem).has(".input-text").length;
    if (wantedItems.includes(itemName) && hasQtyInput) {
      instockItems.push(itemName);
    }
  });
  return instockItems
};

const checkRouge = () => {
    console.log(new Date());
    items.forEach(({url, wantedItems, image}) => {
        axios
            .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
            .then(res => {
                const instockItems = getRougeStock(res.data, wantedItems);
                if (instockItems.length) {
                  instockItems.forEach(itemName => {
                    console.log(`Stock found for ${itemName}!`.green);
                  })
                  notify(url, instockItems, image);
                } else {
                  const pathPieces = url.split('/')
                  const route = pathPieces[pathPieces.length - 1];
                  console.log(`No stock for ${route}`.red);
                }
            })
            .catch(error => {
                console.log(error);
            });
    })
}

module.exports = {
  checkRouge,
  getRougeStock,
};
