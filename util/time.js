const moment = require('moment');

const time = {
    getDateTimeNow(){
        return moment().format();
    }
}

module.exports ={
    time
};