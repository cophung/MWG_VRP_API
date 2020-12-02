const vrp = require("../util/vrp");
const util = require("../util/util");

const ids = util.readFileJson("./db/id.json");
const db = util.readFileJson("./db/db.json");

const cars = { capacity: 20 };

module.exports = {
  handleRoutes: () => vrp.handleVrp(ids, db, 7, cars),
  handleLocations: () => {
    const routes = vrp.handleVrp(ids, db, 7, cars);
    return vrp.handleLocations(routes, db);
  },
};
