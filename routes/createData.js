const express = require("express");

const {
  randomVehicles,
  randomMotor,
  constantMotor,
} = require("../controllers/createData");

const router = express.Router();

router.get("/random/vehicles", randomVehicles);
router.get("/random/motor", randomMotor);
router.get("/constant/motor", constantMotor);

module.exports = router;
