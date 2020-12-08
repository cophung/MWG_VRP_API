const models = require("../models/createData");

module.exports = {
  randomVehicles: function (req, res) {
    const data = models.randomVehicles();
    res.status(200).send({
      success: "true",
      data,
    });
  },
  randomMotor: (req, res) => {
    const data = models.randomMotor();
    res.status(200).send({
      success: "true",
      data,
    });
  },
  constantMotor: (req, res) => {
    const data = models.constantMotor();
    res.status(200).send({
      success: "true",
      data,
    });
  },
};
