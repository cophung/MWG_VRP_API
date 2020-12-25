const fs = require("fs");

module.exports = {
  readFileJson: (path) => {
    return JSON.parse(
      fs.readFileSync(path, {
        encoding: "utf8",
        flag: "r",
      })
    );
  },

  updateUppercaseServiceTime: (db) => {
    return db.map((item) => {
      let x = {};
      x.id = item.id;
      x.distances = item.distances;
      x.timetravels = item.timeTravels;

      let order = {};
      order.weight = item.order.weight;
      order.long = item.order.long;
      order.lat = item.order.lat;
      order.ServiceTime = item.order.serviceTime;
      order.timeWindow = item.order.timeWindow;

      x.order = order;
      return x;
    });
  },
};
