const express = require("express");
const {
    getIndexRoutes,
    getRoutes,
    getRoutes2,
    getLocations,
    getOrders,
    getCustomers,
    getDetailOrders,
    getSubRouteTimeline,
    getTrackData,
    postSubOrders,
} = require("../controllers/index");
const { getPurchaseOrrder } = require("../controllers/tempData");

const router = express.Router();

router.get("/getIndexRoutes", getIndexRoutes);
router.get("/getRoutes", getRoutes);
router.get("/getRoutes2", getRoutes2);
router.get("/getLocations", getLocations);
router.get("/getOrders", getOrders);
router.get("/getCustomers", getCustomers);
router.get("/getDetailOrders", getDetailOrders);
router.get("/getSubRouteTimeline", getSubRouteTimeline);
router.get("/getTrackData", getTrackData);

router.get("/getPurchaseOrrder", getPurchaseOrrder);

router.post("/postSubOrders", postSubOrders);
// router.post("/postTimelineRequest", postTimelineRequest);

module.exports = router;
