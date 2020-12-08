const fs = require("fs");

const { readFileJson } = require("../util/util");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArbitrary = (min, max) => {
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
  let startTime = getRandomArbitrary(8, 17);
  let endTime = getRandomArbitrary(startTime + 2, 22);

  let timeWindow = [
    parseFloat(startTime.toFixed(1)),
    parseFloat(endTime.toFixed(1)),
  ];

  return timeWindow;
};

const createData = (path, numberOfCustomers, isSetServiceTime) => {
  const sampleData = readFileJson(path);
  const randomArray = createRandomArray(numberOfCustomers);
  const distances = createSymmetricArray(randomArray);
  const timeTravels = createTimeTravel(distances);

  const result = distances.map((currentValue, index) => {
    const itemSampleData = sampleData[index];
    const orderItemSampleData = itemSampleData.order;

    if (index !== 0) {
      return {
        ...itemSampleData,
        distances: currentValue,
        timeTravels: timeTravels[index],
        order: {
          ...orderItemSampleData,
          weight: getRandomInt(5, 15),
          serviceTime: isSetServiceTime
            ? parseFloat(getRandomArbitrary(0, 4).toFixed(1))
            : 0,
          timeWindow: createTimeWindow(),
        },
      };
    } else {
      return {
        ...itemSampleData,
        distances: currentValue,
        timeTravels: timeTravels[index],
      };
    }
  });

  return result;
};

module.exports = {
  randomVehicles: () => createData("./db/db.json", 16, true),
  randomMotor: () => createData("./db/db.json", 10, false),
  constantMotor: () => readFileJson("./test/dbMotor.json"),
};
