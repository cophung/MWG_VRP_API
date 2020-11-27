const models = require("../models/index");

module.exports = {
  getRoutes: function (req, res) {
    const routes = models.handleRoutes();
    res.status(201).send({
      success: "true",
      message: routes,
    });
  },
};
