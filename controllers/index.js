const models = require("../models/index");

module.exports = {
  getRoutes: function (req, res) {
    const routes = models.handleRoutes();
    res.status(200).send({
      success: "true",
      routes,
    });
  },
};
