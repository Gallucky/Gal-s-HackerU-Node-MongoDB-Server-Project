const chalk = require("chalk");
const currentDate = require("../../utils/timeStamp");

const Log = {
    get: (location, message) =>
        console.info(chalk.greenBright(`${currentDate()} [${location}] [GET]: ${message}`)),
    post: (location, message) =>
        console.info(chalk.yellowBright(`${currentDate()} [${location}] [POST]: ${message}`)),
    put: (location, message) =>
        console.info(chalk.blueBright(`${currentDate()} [${location}] [PUT]: ${message}`)),
    patch: (location, message) =>
        console.info(
            chalk.ForegroundColor("#ad84e6")(`${currentDate()} [${location}] [PATCH]: ${message}`)
        ),
    delete: (location, message) =>
        console.info(
            chalk.ForegroundColor("#FF5719")(`${currentDate()} [${location}] [DELETE]: ${message}`)
        ),
};

module.exports = Log;
