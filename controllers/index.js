const models = require("../models/index");

module.exports = {
  getIndexRoutes: function (req, res) {
    const routes = models.handleIndexRoutes();
    const startTimes = models.handleStartTimesInIndexRoutes(routes);

    res.status(200).send({
      success: "true",
      routes,
      startTimes,
    });
  },
  getRoutes: function (req, res) {
    const routes = models.handleRoutes();
    res.status(200).send({
      success: "true",
      routes,
    });
  },
  getLocations: function (req, res) {
    const locations = models.handleLocations();
    res.status(200).send({
      success: "true",
      locations,
    });
  },
  getOrders: function (req, res) {
    const orders = models.handleOrders();
    res.status(200).send({
      success: "true",
      orders,
    });
  },
  getCustomers: function (req, res) {
    const customers = models.handleCustomers();
    res.status(200).send({
      success: "true",
      customers,
    });
  },
  // danh sach order ban dau
  getDetailOrders: function (req, res) {
    const orders = models.handleDetailOrders();
    res.status(200).send({
      success: "true",
      orders,
    });
  },

  postSubOrders: (req, res) => {
    const { body } = req;
    const routes = models.handleSubOrdersRoutes(body);
    res.status(200).send({
      success: "true",
      routes,
    });
  },
  postTimelineRequest: (req, res) => {
    const { body } = req;
    const routes = models.handleFooterTimeline(body);
    res.status(200).send({
      success: "true",
      routes,
    });
  },
};
