const express = require("express");
const {
  getIndexRoutes,
  getRoutes,
  getLocations,
  getOrders,
  getCustomers,
  getDetailOrders,
  getDriverWithOrders,
} = require("../controllers/index");

const router = express.Router();

router.get("/getIndexRoutes", getIndexRoutes);
router.get("/getRoutes", getRoutes);
router.get("/getLocations", getLocations);
router.get("/getOrders", getOrders);
router.get("/getCustomers", getCustomers);
router.get("/getDetailOrders", getDetailOrders);
router.get("/getDriverWithOrders", getDriverWithOrders);

router.post("/test", (req, res) => {
  console.log(req.body);
  res.status(200).send({
    success: "true",
    data: req.query,
  });
});

module.exports = router;
