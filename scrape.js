const axios = require("axios");
const cheerio = require("cheerio");
const notifier = require("node-notifier");

require("colors")

const items = require('./items.consts');

const getRougeStock = (html, wantedItems) => {
  const $ = cheerio.load(html);
  const instockItems = [];
  $(".grouped-item-row").each((i, elem) => {
    const itemName = $(elem).find(".item-name").text();
    const hasQtyInput = $(elem).has(".input-text").length;
    if (wantedItems.includes(itemName) && hasQtyInput) {
      instockItems.push(itemName)
    }
  });
  return instockItems
};


const checkRouge = () => {
    console.log(new Date());
    items.forEach(({url, wantedItems, image}) => {
        axios
            .get(url)
            .then(res => {
                const instockItems = getRougeStock(res.data, wantedItems);
                if (instockItems.length) {
                  instockItems.forEach(itemName => {
                    console.log(`Stock found for ${itemName}!`.green);
                  })
                  notifier.notify({
                    title: "Rouge",
                    subtitle: "Found Stock!!!",
                    message: instockItems.join(", "),
                    icon: `./images/rouge.jpeg`,
                    contentImage: `./images/${image}`,
                    open: url,
                    timeout: 1000000,
                    sound: true,
                  });
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
