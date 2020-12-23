const vrp = require("../util/vrp");
const vrpSubOrders = require("../util/vrpSubOrders");
const util = require("../util/util");
const {
  printTwoDimensionalArray,
  printTwoDimensionalArrayFromSubOrders,
  funcSubOrderRoutes,
} = require("../util/vrpSubOrders");

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

  handleSubOrdersRoutes: (orders) => {
    const { data } = orders;
    const subOrdersData = vrpSubOrders.handleSubOrdersData(data, db, ids);
    const indexSubOrdersData = vrpSubOrders.handlePrintIndexSubOrdersData(
      subOrdersData,
      ids
    );
    const distancesTwoDimensionalArrayFromData = printTwoDimensionalArray(
      db,
      "distances"
    );
    const timeTravelsTwoDimensionalArrayFromData = printTwoDimensionalArray(
      db,
      "timeTravels"
    );

    const distancesResult = printTwoDimensionalArrayFromSubOrders(
      indexSubOrdersData,
      distancesTwoDimensionalArrayFromData
    );

    const timeTravelsResult = printTwoDimensionalArrayFromSubOrders(
      indexSubOrdersData,
      timeTravelsTwoDimensionalArrayFromData
    );

    const detailOrders = funcSubOrderRoutes(
      subOrdersData,
      timeTravelsResult,
      distancesResult
    );

    const indexResult = vrp.handleIndexRoutes(
      detailOrders,
      detailOrders,
      8,
      cars
    );

    const result = vrp.handleRoutes(indexResult, detailOrders, detailOrders);

    return result;
  },
};
