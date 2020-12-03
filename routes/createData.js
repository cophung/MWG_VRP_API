const express = require("express");

const { mixVehicles, motor } = require("../controllers/createData");

const router = express.Router();

router.get("/vehicles", mixVehicles);
router.get("/motor", motor);

module.exports = router;
