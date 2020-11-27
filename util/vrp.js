module.exports = {
  handleVrp: function (ids, db, startTime, cars, bikes) {
    let routes = [];

    const createNewRoute = function () {
      let route = [0, 0];
      routes.push(route);
    };

    const getRoutes = () => {
      return routes.filter((r) => r.length > 2);
    };

    const insertNode = (route, node) => {
      route.shift();
      route.unshift(node);
      route.unshift(0);
    };

    const isRouteEmty = (route) => {
      if (route.length < 3) return true;
      return false;
    };

    const getTravelTime = (startNode, endNode) => {
      let timetravels = db.map((x) => x.timeTravels);
      return timetravels[startNode][endNode];
    };

    const getSortedTravelTimes = (startNode) => {
      let timetravels = db.map((x) => x.timeTravels);
      let unSortedTimeTravels = timetravels[startNode].map(function (x, i) {
        return [[startNode, i], x];
      });
      let sortedTimeTravels = unSortedTimeTravels
        .map((x) => x)
        .sort((a, b) => {
          if (a[1] == b[1]) return 0;
          if (a[1] < b[1]) return -1;
          return 1;
        });
      return sortedTimeTravels.filter((x) => x[0][0] != x[0][1]);
    };

    const getSortedTravelTimesOnEndNodes = (endNode) => {
      let timetravels = db.map((x) => x.timeTravels);
      let unSortedTimeTravels = timetravels
        .map((tt) => tt[endNode])
        .map(function (x, i) {
          return [[i, endNode], x];
        });
      let sortedTimeTravels = unSortedTimeTravels
        .map((x) => x)
        .sort((a, b) => {
          if (a[1] == b[1]) return 0;
          if (a[1] < b[1]) return -1;
          return 1;
        });
      return sortedTimeTravels.filter((x) => x[0][0] != x[0][1]);
    };

    const getServiceTime = (node) => {
      let serviceTimes = db.map((x) => x.order.serviceTime);
      return serviceTimes[node];
    };

    const getTimeWindow = (node) => {
      let timeWindows = db.map((x) => x.order.timeWindow);
      return timeWindows[node];
    };

    const calculateTimeAfterServiced = (startNode, endNode, timeStart) => {
      let timeArrived = timeStart + getTravelTime(startNode, endNode);
      //arrive early
      let timeToCallCus;
      if (timeArrived < getTimeWindow(endNode)[0])
        timeToCallCus = getTimeWindow(endNode)[0];
      else timeToCallCus = timeArrived;
      return timeToCallCus + getServiceTime(endNode);
    };

    const isArrivedOnTime = (node, arrivedTime) => {
      let timeWindow = getTimeWindow(node);
      return arrivedTime < timeWindow[1];
    };

    const isInCapacity = (route) => {
      let weights = db.filter((x) => x != db[0]).map((x) => x.order.weight);
      let routeTotalWeight = route
        .filter((x) => x != 0)
        .map((x) => weights[x - 1])
        .reduce((a, b) => a + b);
      return routeTotalWeight <= cars.capacity;
    };

    const isRouteAchievable = (route) => {
      let sTime = startTime;
      for (let i = 0; i < route.length - 3; i++) {
        sTime = calculateTimeAfterServiced(route[i], route[i + 1], sTime);
      }
      let timeArrivedLastNode =
        sTime + getTravelTime(route[route.length - 3], route[route.length - 2]);
      return (
        isArrivedOnTime(route[route.length - 2], timeArrivedLastNode) &&
        isInCapacity(route)
      );
      //return false
    };

    const isOKtoPut = (route, node) => {
      if (isRouteEmty(route)) return true;
      let copiedRoute = route.map((x) => x);
      insertNode(copiedRoute, node);
      return isRouteAchievable(copiedRoute);
    };

    const createCustomers = (numberOfCustomers) => {
      let cus = [];
      for (let i = 1; i < numberOfCustomers; i++) {
        cus.push(i);
      }
      return cus;
    };

    const find = () => {
      let cus = createCustomers(ids.length);
      while (cus.length > 0) {
        if (routes.length == 0) createNewRoute();
        let latestRoute = routes[routes.length - 1];
        let sortedTimeTravels = getSortedTravelTimesOnEndNodes(
          latestRoute[0]
        ).filter((x) => cus.includes(x[0][0]));
        while (cus.length > 0 && sortedTimeTravels.length > 0) {
          if (isOKtoPut(latestRoute, sortedTimeTravels[0][0][0], startTime)) {
            insertNode(latestRoute, sortedTimeTravels[0][0][0]);
            cus = cus.filter((x) => x != sortedTimeTravels[0][0][0]);
          }
          sortedTimeTravels.shift();
        }
        createNewRoute();
      }
    };

    find();
    return getRoutes();
  },
};
