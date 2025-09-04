const chalk = require("chalk");
const currentDate = require("../../utils/timeStamp");

const Log = {
    get: (location, message) =>
        console.log(chalk.greenBright(`${currentDate()} [${location}] [GET]: ${message}`)),
    post: (location, message) =>
        console.log(chalk.yellowBright(`${currentDate()} [${location}] [POST]: ${message}`)),
    put: (location, message) =>
        console.log(chalk.blueBright(`${currentDate()} [${location}] [PUT]: ${message}`)),
    patch: (location, message) =>
        console.log(
            chalk.ForegroundColor("#ad84e6")(`${currentDate()} [${location}] [PATCH]: ${message}`)
        ),
    delete: (location, message) =>
        console.log(
            chalk.ForegroundColor("#FF5719")(`${currentDate()} [${location}] [DELETE]: ${message}`)
        ),
};

module.exports = Log;
