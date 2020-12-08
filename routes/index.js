const express = require("express");
const {
  getRoutes,
  getLocations,
  getOrders,
  getCustomers,
} = require("../controllers/index");

const router = express.Router();

router.get("/getRoutes", getRoutes);
router.get("/getLocations", getLocations);
router.get("/getOrders", getOrders);
router.get("/getCustomers", getCustomers);

module.exports = router;
