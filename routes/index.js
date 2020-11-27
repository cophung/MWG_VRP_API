var express = require("express");
const { getRoutes } = require("../controllers/index");
var router = express.Router();

router.get("/getRoutes", getRoutes);

module.exports = router;
