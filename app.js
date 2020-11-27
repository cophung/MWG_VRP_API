const express = require("express");

var indexRouter = require("./routes/index");

const app = express();
const port = process.env.PORT || 3000;

app.use("/api", indexRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
