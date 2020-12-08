const express = require("express");
const {
  getIndexRoutes,
  getRoutes,
  getLocations,
  getOrders,
  getCustomers,
} = require("../controllers/index");

const router = express.Router();

router.get("/getIndexRoutes", getIndexRoutes);
router.get("/getRoutes", getRoutes);
router.get("/getLocations", getLocations);
router.get("/getOrders", getOrders);
router.get("/getCustomers", getCustomers);

module.exports = router;
