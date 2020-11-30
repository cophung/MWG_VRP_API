const models = require("../models/createData");

module.exports = {
  createData: function (req, res) {
    const data = models.createData();
    res.status(200).send({
      success: "true",
      data,
    });
  },
};
