const express = require("express");

const { createData } = require("../controllers/createData");

const router = express.Router();

router.get("/", createData);

module.exports = router;
