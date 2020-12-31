const express = require("express");
const {
  getIndexRoutes,
  getRoutes,
  getLocations,
  getOrders,
  getCustomers,
  getDetailOrders,

  postSubOrders,
  postTimelineRequest,
} = require("../controllers/index");

const router = express.Router();

router.get("/getIndexRoutes", getIndexRoutes);
router.get("/getRoutes", getRoutes);
router.get("/getLocations", getLocations);
router.get("/getOrders", getOrders);
router.get("/getCustomers", getCustomers);
router.get("/getDetailOrders", getDetailOrders);

router.post("/postSubOrders", postSubOrders);
// router.post("/postTimelineRequest", postTimelineRequest);

module.exports = router;
