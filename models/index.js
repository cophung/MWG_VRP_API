const {
  vrpLocations,
  vrp,
  vrpRoute,
  userSelectOrders,
  footerTimeline,
} = require("../util/vrp");
const { routific } = require("../util/routific");
const { readFileJson, updateUppercaseServiceTime } = require("../util/util");
const { calculator } = require("../util/calculator");

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
    let indexRoutes = vrp.run();

    return indexRoutes;
  },

  handleStartTimesInIndexRoutes: (indexRoutes) => {
    routific.import(updateData, ids, indexRoutes, {});

    const startTimes = indexRoutes.map((item, index) => {
      const timeWindows = routific.getTimeWindowsOnRoute(index);
      const serviceTimes = routific.getServiceTimesOnRoute(index);
      let timeTravles = routific.getTimeTravelsOnRoute(index);

      return calculator.getKhoangThoiGianNenKhoiHanh(
        timeWindows,
        serviceTimes,
        timeTravles
      );
    });

    return startTimes;
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

  handleFooterTimeline: (apiRequest) => {
    vrp.import(updateData, vehicles);
    let indexRoutes = vrp.run();
    footerTimeline.import(indexRoutes, updateData);
    let idRoutes = footerTimeline.toRoutesAccordId();
    let newIdRoutes = footerTimeline.computeTransaction(idRoutes, apiRequest);

    return footerTimeline.toRouteIndex(newIdRoutes);
  },
};
