const express = require("express");
const { getRoutes, getLocations } = require("../controllers/index");

const router = express.Router();

router.get("/getRoutes", getRoutes);
router.get("/getLocations", getLocations);

module.exports = router;
