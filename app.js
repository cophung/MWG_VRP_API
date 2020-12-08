const express = require("express");
const cors = require("cors");

let index = require("./routes/index");
let dataRoutes = require("./routes/createData");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/api", index);
app.use("/create", dataRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
