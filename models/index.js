const {
  vrpLocations,
  vrp,
  vrpRoute,
  userSelectOrders,
} = require("../util/vrp");
const { readFileJson, updateUppercaseServiceTime } = require("../util/util");

const ids = readFileJson("./db/id.json");
const db = readFileJson("./db/db.json");

const vehicles = {
  weight_limit: 30,
  number: 8,
};
const updateData = updateUppercaseServiceTime(db);

module.exports = {
  handleOrders: () => db,

  handleDetailOrders: () => db,

  handleCustomers: () => ids,

  handleIndexRoutes: () => {
    vrp.import(updateData, vehicles);
    let result = vrp.run();
    return result;
  },

  handleRoutes: () => {
    vrp.import(updateData, vehicles);
    let indexRoutes = vrp.run();
    vrpRoute.import(indexRoutes, ids, db);
    return vrpRoute.main();
  },

  handleLocations: () => {
    vrp.import(updateData, vehicles);
    const routes = vrp.run();
    vrpLocations.import(routes, db);
    return vrpLocations.main();
  },

  handleSubOrdersRoutes: (orders) => {
    const { data } = orders;

    userSelectOrders.import(data, db);
    const ordersUpdate = userSelectOrders.main();

    vrp.import(updateUppercaseServiceTime(ordersUpdate), vehicles);
    const indexRoutes = vrp.run();

    vrpRoute.import(indexRoutes, ordersUpdate, ordersUpdate);

    return vrpRoute.main();
  },
};
