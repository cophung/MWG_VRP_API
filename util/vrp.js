const _ = require("lodash");

const vrp = {
  import(db, vehicles) {
    this.orders = db;
    this.vehicles = vehicles;
  },

  getRoutific: function (routes) {
    let routific = [];
    for (let i = 0; i < routes.length; i++) {
      let routeSpecs = [0];
      while (routes[i + 1] > 0 && i < routes.length) {
        routeSpecs.push(routes[i + 1]);
        i++;
      }
      routeSpecs.push(0);
      routific.push(routeSpecs);
    }
    return routific.filter((x) => x.length > 2);
  },

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  },
  CalAmountRoute(ArrayRemoved, orders1) {
    let arr = ArrayRemoved.slice();

    arr.push(0);
    arr.sort(function (a, b) {
      return a - b;
    });

    const findOrder = this.findOrderRoute(arr, orders1);
    const insertroute = this.funcIndexRoute(142205, 30, 5, findOrder, arr);

    let insertrouterest = insertroute.map((x, index) => arr[x]);

    return insertrouterest;
  },
  calTotalTime(arr, orders1) {
    let timeTotal = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      const arrDistances = orders1[arr[i]];

      const distance = arrDistances.timetravels[arr[i + 1]];
      timeTotal += distance;
    }
    return timeTotal;
  },

  // calTotalRoute(arr) {
  //   let routeTotal = 0;
  //   for (let i = 0; i < arr.length - 1; i++) {
  //     const arrDistances = orders[arr[i]];
  //     const distance = arrDistances.distances[arr[i + 1]];
  //     routeTotal += distance;
  //   }
  //   return routeTotal;
  // },

  findNextPoint(arr, arrayTempt, orders1, arrorder) {
    let shortestWay = Number.MAX_VALUE;
    let lastIndex = arr[arr.length - 1];
    let distances = orders1[lastIndex].distances;

    let distancesarray = distances;
    if (arrorder) {
      distancesarray = distances.filter(
        (x, index) => arrorder.indexOf(index) !== -1
      );
    }
    let nextIndex;

    distancesarray.forEach((e, index) => {
      if (
        arr.indexOf(index) < 0 &&
        e < shortestWay &&
        arrayTempt.indexOf(index) < 0
      ) {
        shortestWay = e;
        nextIndex = index;
      }
    });

    return nextIndex;
  },

  CalrouteRouteExiting(arr1, arr2) {
    let total = [];
    let arrRemoved = JSON.parse(JSON.stringify(arr2));
    let arrExiting = JSON.parse(JSON.stringify(arr1));
    for (let i = 0; i < arrExiting.length; i++) {
      total = total.concat(arrExiting[i]);
    }

    total = total.concat(arrRemoved);
    //console.log("total2", total);
    return total;
  },

  // funcGetLocation(arr) {
  //   let routeLocation = [];
  //   arr.forEach((e) => {
  //     const long = orders[e].order.long;
  //     const lat = orders[e].order.lat;
  //     routeLocation.push([long, lat]);
  //   });
  //   return routeLocation;
  // },

  funcIndexRoute(firstId, capacity, time, orders1, arrorder) {
    let routeIndex = [];
    let routeTempt = [];
    let runWhile = true;
    let cargoVolume = 0;
    let totalTimeTravel = 0;
    let TimeTravel = [];
    let arrayTempt = [];

    let arraytime = orders1[0].order.timeWindow;

    let firstIndex = orders1.findIndex((e) => e.id === firstId);
    routeIndex.push(firstIndex);

    while (runWhile) {
      let nextIndex = this.findNextPoint(
        routeIndex,
        arrayTempt,
        orders1,
        arrorder
      );

      if (nextIndex) {
        function funcHandleConditions() {
          if (time) {
            const timeTravle =
              Math.round(
                orders1[nextIndex].timetravels[
                  routeIndex[routeIndex.length - 1]
                ] * 100
              ) / 100;
            const timeService =
              Math.round(orders1[nextIndex].order["ServiceTime"] * 100) / 100;
            let indexATimewindows =
              Math.round(
                (orders1[nextIndex].order["timeWindow"][0] + timeService) * 100
              ) / 100;

            let indexBTimewindows =
              Math.round(
                (orders1[nextIndex].order["timeWindow"][1] + timeService) * 100
              ) / 100;
            let indexCTimewindows =
              Math.round(orders1[nextIndex].order["timeWindow"][0] * 100) / 100;
            let indexDTimewindows =
              Math.round(orders1[nextIndex].order["timeWindow"][1] * 100) / 100;

            let a = Math.round((arraytime[0] + timeTravle) * 100) / 100;
            let b = Math.round((arraytime[1] - timeTravle) * 100) / 100;
            let c = 0.0;
            let d = 0.0;
            if (a > indexCTimewindows) {
              c = Math.round((a + timeService) * 100) / 100;
            } else {
              c = indexATimewindows;
            }
            if (b < indexDTimewindows) {
              d = Math.round((b + timeService) * 100) / 100;
            } else {
              d = indexBTimewindows;
            }

            if (
              (a > indexCTimewindows && a > indexDTimewindows) ||
              (b < indexCTimewindows && b < indexDTimewindows)
            ) {
              arrayTempt.push(nextIndex);
              TimeTravel.push(arraytime);
              const lastIndexRouter = routeIndex[routeIndex.length - 1];

              const result = routeIndex.filter((x) => x != 0);
              if (arrayTempt.length + result.length === orders1.length - 1) {
                if (lastIndexRouter === 0) {
                  runWhile = false;
                }

                routeIndex.push(0);
                arrayTempt = [];
                nextIndex = firstIndex;
                totalTimeTravel = 0;
                cargoVolume = 0;

                arraytime = orders1[0].order.timeWindow;
              }
            } else {
              if (capacity) {
                const orderWeight = orders1[nextIndex].order.weight;
                cargoVolume += orderWeight;

                if (cargoVolume > capacity) {
                  routeIndex.push(0);
                  nextIndex = firstIndex;
                  totalTimeTravel = 0;
                  cargoVolume = 0;

                  arrayTempt = [];
                  arraytime = orders1[0].order.timeWindow;
                } else {
                  routeIndex.push(nextIndex);
                  arrayTempt = [];
                  if (c > d) {
                    arrayTempt = [];
                    routeIndex.push(0);
                    totalTimeTravel = 0;
                    cargoVolume = 0;
                    arraytime = orders1[0].order.timeWindow;
                  } else {
                    arraytime = [c, d];
                  }
                }
              }
            }
          }
        }

        funcHandleConditions();
      } else {
        runWhile = false;
        routeIndex.push(0);
      }
    }

    return routeIndex;
  },
  findMinRoute(arrRoutelength) {
    let shortestWay = Number.MAX_VALUE;
    arrRoutelength.forEach((e) => {
      if (e < shortestWay) {
        shortestWay = e;
      }
    });

    return shortestWay;
  },

  // lengthRoute(arrRemoved, arrorders1) {
  //   let ArrayRemoved = arrRemoved.slice();
  //   let orders1 = JSON.parse(JSON.stringify(arrorders1));
  //   let Car = this.CalAmountRoute(ArrayRemoved, orders1);
  //   let lenCar = this.getRoutific(Car).length;
  //   return lenCar + RoutificDemo.length;
  // },

  // checklengthRoute(lengthRouteFirstRoute, lengthRoute) {
  //   let minlength = lengthRouteFirstRoute;
  //   if (lengthRoute < minlength) {
  //     minlength = lengthRoute;
  //   }
  //   return minlength;
  // },
  // checkRoute(arr) {
  //   let minlength = lengthRouteFirstRoute;
  //   if (lengthRoute < minlength) {
  //     minlength = lengthRoute;
  //   }
  //   return minlength;
  // },

  // findIndexRoute(arrRoutelength, D, arraycalTotalRoute, index2) {
  //   let findIndexRoute = arrRoutelength.indexOf(D);

  //   let E = 0;

  //   arrRoutelength.forEach((e, index) => {
  //     if (
  //       e === D &&
  //       arraycalTotalRoute[index] > E &&
  //       index !== index2 &&
  //       index !== 4
  //     ) {
  //       routelenghtIndexMin = index;
  //     }
  //   });

  //   return routelenghtIndexMin;
  // },

  findOrderRoute(arr, order) {
    let ordernew = [];
    arr.forEach((e, index) => {
      ordernew.push(order[e]);
    });

    return ordernew;
  },

  TinhTime(arr, orders1) {
    let routeIndex = [0];
    let arraytime = [8, 23];
    for (let i = 0; i < arr.length - 1; i++) {
      const timeTravle =
        Math.round(
          orders1[arr[i]].timetravels[routeIndex[routeIndex.length - 1]] * 100
        ) / 100;
      const timeService =
        Math.round(orders1[i].order["ServiceTime"] * 100) / 100;
      let indexATimewindows =
        Math.round((orders1[i].order["timeWindow"][0] + timeService) * 100) /
        100;

      let indexBTimewindows =
        Math.round((orders1[i].order["timeWindow"][1] + timeService) * 100) /
        100;
      let indexCTimewindows =
        Math.round(orders1[i].order["timeWindow"][0] * 100) / 100;
      let indexDTimewindows =
        Math.round(orders1[i].order["timeWindow"][1] * 100) / 100;
      let a = Math.round((arraytime[0] + timeTravle) * 100) / 100;
      let b = Math.round((arraytime[1] - timeTravle) * 100) / 100;
      let c = 0.0;
      let d = 0.0;
      if (a > indexCTimewindows) {
        c = Math.round((a + timeService) * 100) / 100;
      } else {
        c = indexATimewindows;
      }
      if (b < indexDTimewindows) {
        d = Math.round((b + timeService) * 100) / 100;
      } else {
        d = indexBTimewindows;
      }
      arraytime = [c, d];
      routeIndex.push(arr[i]);
    }
    return arraytime;
  },

  run(runtime = 1) {
    let RouteFinish = [];
    let orders1 = this.orders;
    let idDepot = orders1[0].id;
    let weight_limit = this.vehicles.weight_limit;
    const routeIndex = this.funcIndexRoute(
      idDepot,
      weight_limit,
      -1,
      orders1,
      null
    );
    //console.log("index routing: ", routeIndex);
    let CalTotalTimeFirstRoute = this.calTotalTime(routeIndex, orders1);
    let lengthRouteFirstRoute = this.getRoutific(routeIndex).length;
    let Routific = this.getRoutific(routeIndex);
    let RoutificDemo = Routific.slice();

    let LenTotal = [];
    let ArrayRemoved = [];
    for (let i = 0; i < RoutificDemo.length; i++) {
      RoutificDemo[i].pop();
    }
    let f = JSON.parse(JSON.stringify(RoutificDemo));
    let lenf = JSON.parse(JSON.stringify(RoutificDemo)).length;

    for (let Ramdom = 0; Ramdom < runtime; Ramdom++) {
      let c = 0;
      //console.log("lenflenflenflenflenflenflenflenflenflenf",lenf)
      RoutificDemo = JSON.parse(JSON.stringify(f));
      ArrayRemoved = [];
      let RouteTrue = true;
      while (RouteTrue) {
        let IndexMinRouter = this.getRandomInt(0, RoutificDemo.length);
        let Route = RoutificDemo[IndexMinRouter];
        RoutificDemo = RoutificDemo.filter(
          (item, index) => index !== IndexMinRouter
        );

        let FFF = JSON.parse(JSON.stringify(RoutificDemo));
        let Route2 = Route.filter((item, index) => Route.indexOf(item) !== 0);
        ArrayRemoved.push(...Route2);
        let Removed = ArrayRemoved.slice();
        while (0 < Removed.length) {
          FFF = JSON.parse(JSON.stringify(RoutificDemo));
          let b = Removed[Removed.length - 1];
          for (let i = 0; i < RoutificDemo.length; i++) {
            RoutificDemo[i].push(b);
          }
          for (let i = 0; i < RoutificDemo.length; i++) {
            RoutificDemo[i].sort(function (a, b) {
              return a - b;
            });
          }
          let InsertRoute = [];
          for (let i = 0; i < RoutificDemo.length; i++) {
            const findOrder = this.findOrderRoute(RoutificDemo[i], orders1);
            InsertRoute.push(findOrder);
          }
          let arrInsert = [];
          for (let i = 0; i < RoutificDemo.length; i++) {
            const insertroute = this.funcIndexRoute(
              idDepot,
              weight_limit,
              -1,
              InsertRoute[i],
              RoutificDemo[i]
            );
            let routeIndex22 = insertroute.map(
              (x, index) => RoutificDemo[i][x]
            );
            arrInsert.push(routeIndex22);
          }

          Removed.pop();
          RoutificDemo = JSON.parse(JSON.stringify(FFF));

          for (let i = 0; i < arrInsert.length; i++) {
            const X = this.getRoutific(arrInsert[i]);

            if (X.length === 1) {
              let Tempt = JSON.parse(JSON.stringify(FFF));

              X[0].pop();
              Tempt[i] = X[0];

              RoutificDemo = JSON.parse(JSON.stringify(Tempt));
              ArrayRemoved = ArrayRemoved.slice().filter((x) => x !== b);

              break;
            }
          }
        }
        c++;
        if (c === lenf - 1) {
          RouteTrue = false;
        }

        let getRouteRest = this.CalAmountRoute(ArrayRemoved, orders1);
        let calrouteRouteExiting = this.CalrouteRouteExiting(
          RoutificDemo,
          getRouteRest
        );
        let CalTotalTimeRoute = this.calTotalTime(
          calrouteRouteExiting,
          orders1
        );

        let LengthRoute = this.getRoutific(calrouteRouteExiting).length;

        if (lengthRouteFirstRoute > LengthRoute) {
          RouteFinish = calrouteRouteExiting;
          lengthRouteFirstRoute = LengthRoute;
          console.log(RouteFinish);
        }
        if (
          (LengthRoute =
            lengthRouteFirstRoute && CalTotalTimeRoute < CalTotalTimeFirstRoute)
        ) {
          RouteFinish = calrouteRouteExiting;
          CalTotalTimeFirstRoute = CalTotalTimeRoute;
        }
      }
    }
    if (RouteFinish.length === 0) {
      RouteFinish = routeIndex;
    }
    return this.getRoutific(RouteFinish);
  },
};

module.exports = {
  /**
   *
   * @param {array} ids thong tin khach hang
   * @param {array} db thong tin danh sach order
   * @param {number} startTime thoi gian bat dau hoat dong cua kho
   * @param {object} cars { capacity } suc chua cua xe tai
   * @param {*} bikes { capacity } suc chua cua xe motor
   */
  // handleIndexRoutes: function (ids, db, startTime, cars, bikes) {
  //   let routes = [];

  //   const createNewRoute = function () {
  //     let route = [0, 0];
  //     routes.push(route);
  //   };

  //   const getRoutes = () => {
  //     return routes.filter((r) => r.length > 2);
  //   };

  //   const insertNode = (route, node) => {
  //     route.shift();
  //     route.unshift(node);
  //     route.unshift(0);
  //   };

  //   const isRouteEmty = (route) => {
  //     if (route.length < 3) return true;
  //     return false;
  //   };

  //   const getTravelTime = (startNode, endNode) => {
  //     let timetravels = db.map((x) => x.timeTravels);
  //     return timetravels[startNode][endNode];
  //   };

  //   const getSortedTravelTimes = (startNode) => {
  //     let timetravels = db.map((x) => x.timeTravels);
  //     let unSortedTimeTravels = timetravels[startNode].map(function (x, i) {
  //       return [[startNode, i], x];
  //     });
  //     let sortedTimeTravels = unSortedTimeTravels
  //       .map((x) => x)
  //       .sort((a, b) => {
  //         if (a[1] == b[1]) return 0;
  //         if (a[1] < b[1]) return -1;
  //         return 1;
  //       });
  //     return sortedTimeTravels.filter((x) => x[0][0] != x[0][1]);
  //   };

  //   const getSortedTravelTimesOnEndNodes = (endNode) => {
  //     let timetravels = db.map((x) => x.timeTravels);
  //     let unSortedTimeTravels = timetravels
  //       .map((tt) => tt[endNode])
  //       .map(function (x, i) {
  //         return [[i, endNode], x];
  //       });
  //     let sortedTimeTravels = unSortedTimeTravels
  //       .map((x) => x)
  //       .sort((a, b) => {
  //         if (a[1] == b[1]) return 0;
  //         if (a[1] < b[1]) return -1;
  //         return 1;
  //       });
  //     return sortedTimeTravels.filter((x) => x[0][0] != x[0][1]);
  //   };

  //   const getServiceTime = (node) => {
  //     let serviceTimes = db.map((x) => x.order.serviceTime);
  //     return serviceTimes[node];
  //   };

  //   const getTimeWindow = (node) => {
  //     let timeWindows = db.map((x) => x.order.timeWindow);
  //     return timeWindows[node];
  //   };

  //   const calculateTimeAfterServiced = (startNode, endNode, timeStart) => {
  //     let timeArrived = timeStart + getTravelTime(startNode, endNode);
  //     //arrive early
  //     let timeToCallCus;
  //     if (timeArrived < getTimeWindow(endNode)[0])
  //       timeToCallCus = getTimeWindow(endNode)[0];
  //     else timeToCallCus = timeArrived;
  //     return timeToCallCus + getServiceTime(endNode);
  //   };

  //   const isArrivedOnTime = (node, arrivedTime) => {
  //     let timeWindow = getTimeWindow(node);
  //     return arrivedTime < timeWindow[1];
  //   };

  //   const isInCapacity = (route) => {
  //     let weights = db.filter((x) => x != db[0]).map((x) => x.order.weight);
  //     let routeTotalWeight = route
  //       .filter((x) => x != 0)
  //       .map((x) => weights[x - 1])
  //       .reduce((a, b) => a + b);
  //     return routeTotalWeight <= cars.capacity;
  //   };

  //   const isRouteAchievable = (route) => {
  //     let sTime = startTime;
  //     for (let i = 0; i < route.length - 3; i++) {
  //       sTime = calculateTimeAfterServiced(route[i], route[i + 1], sTime);
  //     }
  //     let timeArrivedLastNode =
  //       sTime + getTravelTime(route[route.length - 3], route[route.length - 2]);
  //     return (
  //       isArrivedOnTime(route[route.length - 2], timeArrivedLastNode) &&
  //       isInCapacity(route)
  //     );
  //     //return false
  //   };

  //   const isOKtoPut = (route, node) => {
  //     if (isRouteEmty(route)) return true;
  //     let copiedRoute = route.map((x) => x);
  //     insertNode(copiedRoute, node);
  //     return isRouteAchievable(copiedRoute);
  //   };

  //   const createCustomers = (numberOfCustomers) => {
  //     let cus = [];
  //     for (let i = 1; i < numberOfCustomers; i++) {
  //       cus.push(i);
  //     }
  //     return cus;
  //   };

  //   const find = () => {
  //     let cus = createCustomers(ids.length);
  //     while (cus.length > 0) {
  //       if (routes.length == 0) createNewRoute();
  //       let latestRoute = routes[routes.length - 1];
  //       let sortedTimeTravels = getSortedTravelTimesOnEndNodes(
  //         latestRoute[0]
  //       ).filter((x) => cus.includes(x[0][0]));
  //       while (cus.length > 0 && sortedTimeTravels.length > 0) {
  //         if (isOKtoPut(latestRoute, sortedTimeTravels[0][0][0], startTime)) {
  //           insertNode(latestRoute, sortedTimeTravels[0][0][0]);
  //           cus = cus.filter((x) => x != sortedTimeTravels[0][0][0]);
  //         }
  //         sortedTimeTravels.shift();
  //       }
  //       createNewRoute();
  //     }
  //   };

  //   find();
  //   return getRoutes();
  // },

  handleIndexRoutes: (orders, vehicles) => {
    vrp.import(orders, vehicles);
    const result = vrp.run(20);
    return result;
  },

  handleRoutes: (indexRoutes, customers, orders) => {
    let routes = indexRoutes.map((subIndexRoutes) => {
      let detailRoute = subIndexRoutes.map((index) => {
        const order = orders[index];
        const cloneOrder = _.cloneDeep(
          _.omit(order, ["distances", "timeTravels"])
        );
        cloneOrder.name = customers[index].name;

        return cloneOrder;
      });

      return detailRoute;
    });

    return routes;
  },

  //
  handleLocations: (routes, db) => {
    let routesLocations = routes.map((route, index) => {
      let temptLocations = route.map((e) => {
        return {
          long: db[e].order.long,
          lat: db[e].order.lat,
        };
      });

      return temptLocations;
    });
    return routesLocations;
  },

  /**
   *
   * @param {*} orders
   * @param {*} customers
   */
  //chi tiet don hang ban dau
  handleDetailOrders: (orders, customers) => {
    let cloneOrders = orders.map((order, index) => {
      const cloneOrder = _.cloneDeep(
        _.omit(order, ["distances", "timeTravels"])
      );
      cloneOrder.name = customers[index].name;
      return cloneOrder;
    });

    return cloneOrders;
  },

  /**
   *
   * @param {array} indexRoutes mang index tuyen duong
   * @param {array} orders thong tin mang order ban dau
   */
  handleTimeTravels: (indexRoutes, orders) => {
    let timeTravels = [];
    indexRoutes.forEach((indexRoute) => {
      let subTimeTravels = [];
      for (let index = 0; index < indexRoute.length - 1; index++) {
        subTimeTravels.push(orders[index].timeTravels[index + 1]);
      }
      timeTravels.push(subTimeTravels);
    });
    return timeTravels;
  },

  /**
   *
   * @param {array} routes  tuyen duong chi tiet
   * @param {array} timeTravels chua danh sach mang time travel
   * @param {array} drivers  danh sach thong tin tai xe
   * @param {object} cars { capacity }
   */
  handleDriverWithOrder: (routes, timeTravels, drivers, cars) => {
    const { capacity } = cars;
    const routesWithDrivers = routes.map((route, index) => {
      const { id, name } = drivers[index];
      let weightOrders = 0;

      route.forEach((subRoute) => {
        const { weight } = subRoute.order;
        weightOrders += weight;
      });

      return {
        id,
        name,
        ngay: 0,
        thang: 0,
        capacity,
        weightOrders,
        timeTravels: timeTravels[index],
        route,
      };
    });

    return routesWithDrivers;
  },
};
