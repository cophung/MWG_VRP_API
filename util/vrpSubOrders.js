const _ = require("lodash");

module.exports = {
  /**
   * chuyen doi data gui tu FE
   * @param {array} orders data tu FE
   * @param {array} dbOrders data orders
   * @param {array} idCustomers data customers
   */
  handleSubOrdersData: (orders, dbOrders, idCustomers) => {
    const cloneOrders = orders.map((item) => {
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
        place,
        order: { weight, long, lat, serviceTime, timeWindow },
        name,
      };
    });

    const cloneDepot = _.cloneDeep(dbOrders[0]);
    const depot = _.omit(cloneDepot, ["timeTravels", "distances"]);
    depot.name = idCustomers[0].name;

    return [depot, ...cloneOrders];
  },

  /**
   * in ra index cua orders
   * @param {array} orders data orders gui len tu FE
   * @param {*} customers data khach hang
   */
  handlePrintIndexSubOrdersData: (orders, customers) => {
    const result = orders.map((item, index) => {
      const { id } = item;
      let indexCustomer;

      customers.forEach((customer, i) => {
        if (id === customer.id) {
          indexCustomer = i;
        }
      });

      return indexCustomer;
    });

    return result;
  },

  printTwoDimensionalArray: (ordersData, option) => {
    const result = ordersData.map((item) => {
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

  printTwoDimensionalArrayFromSubOrders: (
    indexSubOrderArray,
    twoDimensionalArray
  ) => {
    const result = indexSubOrderArray.map((item) => {
      const itemTwoDimensionalArray = twoDimensionalArray[item];
      const subResult = indexSubOrderArray.map((subItem) => {
        return itemTwoDimensionalArray[subItem];
      });

      return subResult;
    });

    return result;
  },

  funcSubOrderRoutes: (
    orders,
    timeTravelsTwoDimensionalArr,
    distancesTwoDimensionalArray
  ) => {
    const result = orders.map((item, index) => {
      const cloneItem = _.cloneDeep(item);

      cloneItem.distances = distancesTwoDimensionalArray[index];
      cloneItem.timeTravels = timeTravelsTwoDimensionalArr[index];

      return cloneItem;
    });

    return result;
  },
};
