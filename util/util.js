const fs = require("fs");

module.exports = {
  readFileJson: (path) => {
    return JSON.parse(
      fs.readFileSync(path, {
        encoding: "utf8",
        flag: "r",
      })
    );
  },
};
