const {
  vrpLocations,
  vrp,
  vrpRoute,
  userSelectOrders,
  footerTimeline,
} = require("../util/vrp");
const { routific } = require("../util/routific");
const {
  readFileJson,
  writeFileJson,
  updateUppercaseServiceTime,
} = require("../util/util");
const { calculator } = require("../util/calculator");

const 
{
  time
} = require("../util/time");



const idDB = readFileJson("./db/db1/id.json");
const DB = readFileJson("./db/db1/db.json");

const vehicles = {
  weight_limit: 30,
  number: 8,
};
const updateData = updateUppercaseServiceTime(DB);

module.exports = {
  handleOrders: () => DB,

  handleDetailOrders: () => DB,

  handleCustomers: () => idDB,

  handleIndexRoutes: () => {
    vrp.import(updateData, vehicles);
    let indexRoutes = vrp.run();

    return indexRoutes;
  },

  handleStartTimesInIndexRoutes: (indexRoutes) => {
    routific.import(updateData, idDB, indexRoutes, {});

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
    vrpRoute.import(indexRoutes, idDB, DB);
    return vrpRoute.main();
  },

  handleRoutes2: () => {
    const DB2 = readFileJson("./db/db5/db.json");
    const updateData2 = updateUppercaseServiceTime(DB2);

    vrp.import(updateData2, vehicles);
    let indexRoutes2 = vrp.run();
    vrpRoute.import(indexRoutes2, DB2, DB2);
    return vrpRoute.main();
  },

  handleLocations: () => {
    vrp.import(updateData, vehicles);
    const routes = vrp.run();
    vrpLocations.import(routes, DB);
    return vrpLocations.main();
  },

  handleSubOrdersRoutes: (orders) => {
    const { data } = orders;

    userSelectOrders.import(data, DB);
    const ordersUpdate = userSelectOrders.main();

    vrp.import(updateUppercaseServiceTime(ordersUpdate), vehicles);
    const indexRoutes = vrp.run();

    vrpRoute.import(indexRoutes, ordersUpdate, ordersUpdate);

    //write data temp
    writeFileJson("./db/temp/data.json", {
      routes: vrpRoute.main(),
      orders: ordersUpdate,
      startTimes: module.exports.handleStartTimesInIndexRoutes(indexRoutes),
    });

    return vrpRoute.main();
  },

  getSubRouteTimeline: () => {
    return readFileJson("./db/temp/data.json");
  },

  handleFooterTimeline: (apiRequest) => {
    vrp.import(updateData, vehicles);
    let indexRoutes = vrp.run();
    footerTimeline.import(indexRoutes, updateData);
    let idRoutes = footerTimeline.toRoutesAccordId();
    let newIdRoutes = footerTimeline.computeTransaction(idRoutes, apiRequest);

    return footerTimeline.toRouteIndex(newIdRoutes);
  },

  handleUpdateNextStatus: (orderId, statusId) => {
    const trackData = readFileJson("./db/temp/track.json");
    const isMatch = (order) => {
      return order.id == orderId;
    };

    const orderIdIndex = trackData.orders.findIndex(isMatch);

    const findXY = (index) => {
      let corXY =  {
        i : -1,
        j : -1
      };
      trackData.routes.map((route,i) => {
        if(route.includes(index))
        {
          corXY.i = i;
          corXY.j = route.findIndex(x => x == index)
        }
        return route;
      })

      return corXY;
    };

    const statusXY = findXY(orderIdIndex);
    trackData.statuses[statusXY.i][statusXY.j] = statusId;

    writeFileJson("./db/temp/track.json", trackData);

    const modified = time.getDateTimeNow();
    writeFileJson("./db/temp/noti.json", modified);

  },

  getTrackData: () => {
    return readFileJson("./db/temp/track.json");
  },
  handleResetTrackData: () => {
    const trackData = readFileJson("./db/dbTrack/track.json");
    writeFileJson("./db/temp/track.json", trackData);
    const modified = time.getDateTimeNow();
    writeFileJson("./db/temp/noti.json", modified);
  },
  handleResetDB: () => {
    const db = readFileJson("./db/db1/dbBackup.json");
    const id = readFileJson("./db/db1/idBackup.json");
    writeFileJson("./db/db1/db.json", db);
    writeFileJson("./db/db1/id.json", id);
  },
  getModifiedDate : () => {
    return readFileJson("./db/temp/noti.json");
  }
};
