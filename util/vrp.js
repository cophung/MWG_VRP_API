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

    if (lenf === 1) {
      return this.getRoutific(routeIndex);
    }

    for (let Ramdom = 0; Ramdom < runtime; Ramdom++) {
      let c = 0;
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

const vrpRoute = {
  import(indexRoutes, customers, orders) {
    this.indexRoutes = indexRoutes;
    this.customers = customers;
    this.orders = orders;
  },
  main() {
    const routes = this.indexRoutes.map((subIndexRoutes) => {
      const detailRoute = subIndexRoutes.map((index) => {
        const order = this.orders[index];
        const cloneOrder = _.cloneDeep(
          _.omit(order, ["distances", "timeTravels"])
        );
        cloneOrder.name = this.customers[index].name;
        return cloneOrder;
      });
      return detailRoute;
    });

    return routes;
  },
};

const vrpLocations = {
  import(routes, orders) {
    this.routes = routes;
    this.orders = orders;
  },
  main() {
    const routesLocations = this.routes.map((route) => {
      const temptLocations = route.map((e) => {
        return {
          long: this.orders[e].order.long,
          lat: this.orders[e].order.lat,
        };
      });

      return temptLocations;
    });
    return routesLocations;
  },
};

const userSelectOrders = {
  import(orders, dbOrders) {
    this.orders = _.cloneDeep(orders);
    this.dbOrders = _.cloneDeep(dbOrders);
  },
  subOrdersData() {
    const cloneOrders = this.orders.map((item) => {
      const {
        id,
        long,
        lat,
        name,
        place,
        serviceTime,
        timeWindow,
        weight,
      } = item;

      return {
        id,
        name,
        place,
        order: { weight, long, lat, serviceTime, timeWindow },
      };
    });

    const cloneDepot = _.cloneDeep(this.dbOrders[0]);
    const { id, place, order } = cloneDepot;
    const nameDepot = this.dbOrders[0].name;

    return [{ id, name: nameDepot, place, order }, ...cloneOrders];
  },
  indexSubOrdersVsTotalOrders() {
    const orders = this.subOrdersData();
    const result = orders.map((item, index) => {
      const { id } = item;
      let indexCustomer;

      this.dbOrders.forEach((customer, i) => {
        if (id === customer.id) {
          indexCustomer = i;
        }
      });

      return indexCustomer;
    });

    return result;
  },
  handleArrayOptions(option) {
    const result = this.dbOrders.map((item) => {
      switch (option) {
        case "distances":
          const { distances } = item;
          return distances;
        case "timeTravels":
          const { timeTravels } = item;
          return timeTravels;
        default:
          break;
      }
    });

    return result;
  },
  timeTravelsArrayFromOrdersSelect() {
    const indexOrders = this.indexSubOrdersVsTotalOrders();
    const timeTravelsArrray = this.handleArrayOptions("timeTravels");

    const result = indexOrders.map((item) => {
      const subTimeTravelsArray = timeTravelsArrray[item];
      const timeTravels = indexOrders.map((subItem) => {
        return subTimeTravelsArray[subItem];
      });
      return timeTravels;
    });
    return result;
  },
  distancesArrayFromOrdersSelect() {
    const indexOrders = this.indexSubOrdersVsTotalOrders();
    const distancesArray = this.handleArrayOptions("distances");

    const result = indexOrders.map((item) => {
      const subDistancesArray = distancesArray[item];
      const distances = indexOrders.map((subItem) => {
        return subDistancesArray[subItem];
      });
      return distances;
    });
    return result;
  },
  assignTimeTravelsAndDistancesToOrders() {
    const orders = this.subOrdersData();
    const timeTravel = this.timeTravelsArrayFromOrdersSelect();
    const distances = this.distancesArrayFromOrdersSelect();

    const result = orders.map((item, index) => {
      const cloneItem = _.cloneDeep(item);

      cloneItem.distances = distances[index];
      cloneItem.timeTravels = timeTravel[index];

      return cloneItem;
    });
    return result;
  },
  main() {
    const result = this.assignTimeTravelsAndDistancesToOrders();
    return result;
  },
};

module.exports = {
  vrp,
  vrpRoute,
  vrpLocations,
  userSelectOrders,
};
