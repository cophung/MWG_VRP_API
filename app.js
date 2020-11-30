const express = require("express");

let indexRouter = require("./routes/index");
let dataRoutes = require("./routes/createData");

const app = express();
const port = process.env.PORT || 3000;

app.use("/api", indexRouter);
app.use("/createData", dataRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
