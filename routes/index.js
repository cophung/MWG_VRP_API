const express = require("express");
const { getRoutes } = require("../controllers/index");

const router = express.Router();

router.get("/getRoutes", getRoutes);

module.exports = router;
