const axios = require("axios");
const cheerio = require("cheerio");
const figlet = require("figlet");
const notifier = require("node-notifier");

require("colors")

const rouge = [
  {
    url: "https://www.roguefitness.com/rogue-calibrated-lb-steel-plates",
    image: "calibrated.jpg", // used for notification
    wantedItems: [
      // "0.25LB Calibrated Plate - Pair", // used for testing
      // "1LB Calibrated Plate - Pair", // used for testing
      // "10LB Calibrated Plate - Pair", // used for testing
      "35LB Calibrated Plate - Pair",
      "45LB Calibrated Plate - Pair",
      "55LB Calibrated Plate - Pair",
    ],
  },
  {
    url: "https://www.roguefitness.com/rogue-6-shooter-olympic-plates",
    image: "6-shooter.jpg",
    wantedItems: [
      "35LB 6-Shooter Olympic Grip Plates - Pair",
      "45LB 6-Shooter Olympic Grip Plates - Pair",
    ],
  },
  {
    url: "https://www.roguefitness.com/rogue-machined-olympic-plates",
    image: "machined.jpg",
    wantedItems: [
      "35LB Machined Olympic Plate - Pair",
      "45LB Machined Olympic Plate - Pair",
    ],
  },
];

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
    rouge.forEach(({url, wantedItems, image}) => {
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
                    // sound: "ding.mp3",
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

const app = () => {
  console.log(figlet.textSync("Rouge", { font: "isometric3" }));
  setInterval(checkRouge, 60000);
}

app();