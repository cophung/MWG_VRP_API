const fs = require("fs");

const vrp = require("../util/vrp");

module.exports = {
  handleRoutes: function () {
    const cars = { capacity: 20 };

    const ids = JSON.parse(
      fs.readFileSync("./db/id.json", {
        encoding: "utf8",
        flag: "r",
      })
    );
    const db = JSON.parse(
      fs.readFileSync("./db/db.json", {
        encoding: "utf8",
        flag: "r",
      })
    );

    const routes = vrp.handleVrp(ids, db, 7, cars);
    return routes;
  },
};
