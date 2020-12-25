const { readFileJson } = require("../util/util");
const {
  handleIndexRoutes,
  handleRoutes,
  handleLocations,
  handleDetailOrders,
  handleTimeTravels,
  handleDriverWithOrder,
} = require("../util/vrp");
const {
  handleSubOrdersData,
  handleIndexSubOrdersVsTotalOrders,
  handleTwoDimensionalArray,
  handleTwoDimensionalArrayFromSubOrders,
  handleAssignTimeTravelsAndDistancesValueToSubOrdersData,
} = require("../util/vrpSubOrders");
const { updateUppercaseServiceTime } = require("../util/util");

const ids = readFileJson("./db/id.json");
const db = readFileJson("./db/db.json");

const cars = { capacity: 15 };
const vehicles = {
  weight_limit: 30,
  number: 8,
};
const updateData = updateUppercaseServiceTime(db);

module.exports = {
  handleIndexRoutes: () => handleIndexRoutes(updateData, vehicles),
  handleRoutes: () => {
    const indexRoutes = handleIndexRoutes(ids, db, 7, cars);
    const routes = handleRoutes(indexRoutes, ids, db);
    return routes;
  },
  handleLocations: () => {
    const routes = handleIndexRoutes(ids, db, 7, cars);
    return handleLocations(routes, db);
  },
  handleOrders: () => db,
  handleCustomers: () => ids,
  handleDetailOrders: () => handleDetailOrders(db, ids),
  handleDriverWithOrders: () => {
    const indexRoutes = handleIndexRoutes(ids, db, 7, cars);
    const routes = handleRoutes(indexRoutes, ids, db);
    const timeTravels = handleTimeTravels(indexRoutes, db);
    const drivers = readFileJson("./db/drivers.json");

    return handleDriverWithOrder(routes, timeTravels, drivers, cars);
  },

  handleSubOrdersRoutes: (orders) => {
    const { data } = orders;
    const subOrdersData = handleSubOrdersData(data, db, ids);
    const indexSubOrdersVsTotalOrders = handleIndexSubOrdersVsTotalOrders(
      subOrdersData,
      ids
    );
    const distancesTwoDimensionalArrayFromOrdersData = handleTwoDimensionalArray(
      db,
      "distances"
    );
    const timeTravelsTwoDimensionalArrayFromOrdersData = handleTwoDimensionalArray(
      db,
      "timeTravels"
    );
    const distancesTwoDimensionalArrayFromSubOrdersData = handleTwoDimensionalArrayFromSubOrders(
      indexSubOrdersVsTotalOrders,
      distancesTwoDimensionalArrayFromOrdersData
    );
    const timeTravelsTwoDimensionalArrayFromSubOrdersData = handleTwoDimensionalArrayFromSubOrders(
      indexSubOrdersVsTotalOrders,
      timeTravelsTwoDimensionalArrayFromOrdersData
    );
    const updateSubOrdersData = handleAssignTimeTravelsAndDistancesValueToSubOrdersData(
      subOrdersData,
      timeTravelsTwoDimensionalArrayFromSubOrdersData,
      distancesTwoDimensionalArrayFromSubOrdersData
    );
    const indexSubOrdersRoutes = handleIndexRoutes(
      updateSubOrdersData,
      updateSubOrdersData,
      8,
      cars
    );
    const result = handleRoutes(
      indexSubOrdersRoutes,
      updateSubOrdersData,
      updateSubOrdersData
    );

    return result;
  },
};
