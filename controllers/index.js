const models = require("../models/index");

module.exports = {
  getIndexRoutes: function (req, res) {
    const indexRoutes = models.handleIndexRoutes();
    const startTimes = models.handleStartTimesInIndexRoutes(indexRoutes);

    res.status(200).send({
      success: "true",
      routes: indexRoutes,
      startTimes,
      mode:"tracking"
    });
  },
  getRoutes: function (req, res) {
    const routes = models.handleRoutes();
    res.status(200).send({
      success: "true",
      routes,
    });
  },
  getRoutes2: (req, res) => {
    const routes = models.handleRoutes2();
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

  getSubRouteTimeline: function (req, res) {
    const routeTimeline = models.getSubRouteTimeline();
    res.status(200).send({
      success: "true",
      data: routeTimeline,
      mode:"cordinating"
    });
  },
  getTrackData: function (req, res){
    const tr = models.getTrackData();
    const orders = tr.orders;
    const routes = tr.routes;
    const startTimes = tr.startTimes;
    const statuses = tr.statuses;

    res.status(200).send({
      success: "true",
      orders,
      routes,
      startTimes,
      statuses,
      mode:"tracking"
    });
  },

  postNextStatus : (req, res) => {
    const {body} = req;

    models.handleUpdateNextStatus(body.orderId, body.statusId);

    res.status(200).send({
      success: "true",
      message: "Cập nhật trạng thái thành công"
    })
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
  postResetTrackData: (req, res) => {
    models.handleResetTrackData();
    res.status(200).send({
      success: "true",
      message: "Reset Track Data Thành Công",
    });
  },
  postResetDB: (req, res) => {
    models.handleResetDB();
    res.status(200).send({
      success: "true",
      message: "Reset DB Thành Công",
    });
  },
  getModifiedDate: (req, res) => {
    const modified = models.getModifiedDate();
    res.status(200).send({
      success: "true",
      modified,
    });
  }
  
};
