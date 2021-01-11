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

  writeFileJson: (path, data) => {
    try {
      let stringifyData = JSON.stringify(data);
      fs.writeFileSync(path, stringifyData);
      console.log("Write JSON File success");
    } catch (error) {
      console.log("Write JSON File Error", error);
    }
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
