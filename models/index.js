const fs = require("fs");

const vrp = require("../util/vrp");

const readFileJson = (path) => {
  return JSON.parse(
    fs.readFileSync(path, {
      encoding: "utf8",
      flag: "r",
    })
  );
};

const ids = readFileJson("./db/id.json");
const db = readFileJson("./db/db.json");

const cars = { capacity: 20 };

const routes = vrp.handleVrp(ids, db, 7, cars);

module.exports = {
  handleRoutes: () => routes,
};
