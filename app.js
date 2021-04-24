const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

let index = require("./routes/index");
let dataRoutes = require("./routes/createData");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", index);
app.use("/create", dataRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

//test