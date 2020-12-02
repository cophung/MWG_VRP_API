const fs = require("fs");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const getRandomFloat = (min, max) => {
  let temptNumber = Math.random() * (max - min) + min;
  let numberRandom = Math.round(temptNumber * 100) / 100;

  return numberRandom;
};

const createRandomArray = (number) => {
  let item = [],
    result = [];

  for (let i = 0; i < number; i++) {
    for (let j = 0; j < number; j++) {
      let distance = getRandomInt(1, 10);
      item.push(distance);
    }
    result.push(item);
    item = [];
  }

  return result;
};

const createSymmetricArray = (arr) => {
  let temptArray = JSON.parse(JSON.stringify(arr));

  for (let i = 0; i < temptArray.length; i++) {
    for (let j = 0; j < temptArray[i].length; j++) {
      if (i === j) {
        temptArray[i][j] = 0;
      } else if (i < j) {
        temptArray[j][i] = temptArray[i][j];
      }
    }
  }
  return temptArray;
};

const createTimeTravel = (arr) => {
  let temptArray = JSON.parse(JSON.stringify(arr));

  for (let i = 0; i < temptArray.length; i++) {
    for (let j = 0; j < temptArray[i].length; j++) {
      let time = temptArray[i][j] / (30 + Math.random());
      temptArray[i][j] = Math.round(time * 100) / 100;
    }
  }

  let arrTimeTravel = createSymmetricArray(temptArray);

  return arrTimeTravel;
};

const createTimeWindow = () => {
  let startTime = getRandomFloat(8, 23);
  let endTime = getRandomFloat(startTime + 2, 23);
  let timeWindow = [startTime, endTime];

  return timeWindow;
};

const readFileJson = (path) => {
  return JSON.parse(
    fs.readFileSync(path, {
      encoding: "utf8",
      flag: "r",
    })
  );
};

const createData = (path) => {
  const sampleData = readFileJson(path);
  const randomArray = createRandomArray(17);
  const distances = createSymmetricArray(randomArray);
  const timeTravels = createTimeTravel(distances);

  const result = sampleData.map((currentValue, index) => {
    let order = currentValue.order;

    if (index !== 0) {
      order = {
        ...order,
        weight: getRandomInt(5, 15),
        serviceTime: getRandomFloat(0, 4),
        timeWindow: createTimeWindow(),
      };
    }

    const newCurrentValue = {
      ...currentValue,
      distances: distances[index],
      timeTravels: timeTravels[index],
      order: { ...order },
    };

    return newCurrentValue;
  });

  return result;
};

module.exports = {
  createData: () => createData("./db/db.json"),
};
