const models = require("../models/createData");

module.exports = {
  mixVehicles: function (req, res) {
    const data = models.mixVehicles();
    res.status(200).send({
      success: "true",
      data,
    });
  },
  motor: (req, res) => {
    const data = models.motor();
    res.status(200).send({
      success: "true",
      data,
    });
  },
};
