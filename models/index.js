const vrp = require("../util/vrp");
const util = require("../util/util");

const ids = util.readFileJson("./db/id.json");
const db = util.readFileJson("./db/db.json");

const cars = { capacity: 15 };

module.exports = {
  handleIndexRoutes: () => vrp.handleIndexRoutes(ids, db, 7, cars),
  handleRoutes: () => {
    const indexRoutes = vrp.handleIndexRoutes(ids, db, 7, cars);
    const routes = vrp.handleRoutes(indexRoutes, ids, db);
    return routes;
  },
  handleLocations: () => {
    const routes = vrp.handleIndexRoutes(ids, db, 7, cars);
    return vrp.handleLocations(routes, db);
  },
  handleOrders: () => db,
  handleCustomers: () => ids,
  handleDetailOrders: () => vrp.handleDetailOrders(db, ids),
  handleDriverWithOrders: () => {
    const indexRoutes = vrp.handleIndexRoutes(ids, db, 7, cars);
    const routes = vrp.handleRoutes(indexRoutes, ids, db);

    const timeTravels = vrp.handleTimeTravels(indexRoutes, db);

    const drivers = util.readFileJson("./db/drivers.json");

    return vrp.handleDriverWithOrder(routes, timeTravels, drivers, cars);
  },
};
