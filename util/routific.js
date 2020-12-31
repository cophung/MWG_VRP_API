const routific = {
  import(db, ids, routes, calculator = {}) {
    this.calculator = calculator;
    this.db = db;
    this.ids = ids;
    this.routes = routes;
  },
  getServiceTimesOnRoute(index) {
    return this.routes[index]
      .filter((x) => x != 0)
      .map(function (node, i) {
        return routific.db[node].order.ServiceTime;
      });
  },
  getTimeWindowsOnRoute(index) {
    return this.routes[index]
      .filter(function (node, i) {
        if (node == 0) return false;
        return true;
      })
      .map(function (node, i) {
        return routific.db[node].order.timeWindow;
      });
  },
  getTimeTravelsOnRoute(index) {
    return routific.routes[index]
      .map(function (node, i) {
        if (i == routific.routes[index].length - 1) return -1;
        return routific.db[node].timetravels[routific.routes[index][i + 1]];
      })
      .filter((x) => x != -1);
  },
  getRoutificOnRoute(index) {
    let serviceTimesOnRoute = this.getServiceTimesOnRoute(index);
    let timeWindowsOnRoute = this.getTimeWindowsOnRoute(index);
    let timeTravelsOnRoute = this.getTimeTravelsOnRoute(index);

    let timeStartOnDepot = this.calculator.getThoiDiemDiNenBatDau(
      timeWindowsOnRoute,
      serviceTimesOnRoute,
      timeTravelsOnRoute.filter(function (x, i) {
        if (i == timeTravelsOnRoute.length - 1) return false;
        return true;
      })
    );

    let timeEndOnDepot =
      timeStartOnDepot +
      serviceTimesOnRoute.reduce((a, b) => a + b) +
      timeTravelsOnRoute.reduce((a, b) => a + b);

    let r = [];
    let depotSchedule = {
      startTime: timeStartOnDepot,
      endTime: timeEndOnDepot,
    };
    r.push(depotSchedule);

    //
    let tempSchedule = {
      startTime: timeStartOnDepot,
      endTime: timeStartOnDepot,
    };
    for (i = 0; i < timeTravelsOnRoute.length - 1; i++) {
      tempSchedule.startTime = tempSchedule.endTime + timeTravelsOnRoute[i];
      tempSchedule.endTime = tempSchedule.startTime + serviceTimesOnRoute[i];
      r.push(JSON.parse(JSON.stringify(tempSchedule)));
    }
    return r;
  },

  getRoutificPeriodOnRoute(index) {
    let serviceTimesOnRoute = this.getServiceTimesOnRoute(index);
    let timeWindowsOnRoute = this.getTimeWindowsOnRoute(index);
    let timeTravelsOnRoute = this.getTimeTravelsOnRoute(index);

    let timePeriodStartOnDepot = this.calculator.getKhoangThoiGianKhoiHanh(
      timeWindowsOnRoute,
      serviceTimesOnRoute,
      timeTravelsOnRoute.filter(function (x, i) {
        if (i == timeTravelsOnRoute.length - 1) return false;
        return true;
      })
    );

    let timePeriodEndOnDepot = timePeriodStartOnDepot.map(
      (x) =>
        x +
        serviceTimesOnRoute.reduce((a, b) => a + b) +
        timeTravelsOnRoute.reduce((a, b) => a + b)
    );

    let r = [];
    let depotSchedule = {
      startPeriod: timePeriodStartOnDepot,
      endPeriod: timePeriodEndOnDepot,
    };
    r.push(depotSchedule);

    //
    let tempSchedule = {
      startPeriod: timePeriodStartOnDepot,
      endPeriod: timePeriodStartOnDepot,
    };
    for (i = 0; i < timeTravelsOnRoute.length - 1; i++) {
      tempSchedule.startPeriod = tempSchedule.endPeriod.map(
        (x) => x + timeTravelsOnRoute[i]
      );
      tempSchedule.endPeriod = tempSchedule.startPeriod.map(
        (x) => x + serviceTimesOnRoute[i]
      );
      r.push(JSON.parse(JSON.stringify(tempSchedule)));
    }
    return r;
  },
  getRoutificPeriod() {
    return this.routes.map(function (route, i) {
      return routific.getRoutificPeriodOnRoute(i);
    });
  },

  getRoutific() {
    return this.routes.map(function (route, i) {
      return routific.getRoutificOnRoute(i);
    });
  },
};

module.exports = { routific };
