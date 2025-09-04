const chalk = require("chalk");
const currentDate = require("./timeStamp");
const getLocationFromErrorStack = require("./getLocationFormatted");

const handleError = (res, status, err) => {
    const message = err.message;
    const location = getLocationFromErrorStack(err.stack);
    let shownErrorMessage = `${currentDate()} [${location.file}] [Line: ${location.line}]`;
    const index = message.toLowerCase().indexOf("error:");

    if (index !== -1) {
        shownErrorMessage += ` [${message.substring(0, index + 5)}]: ${message.substring(
            index + 7
        )}`;
    } else {
        shownErrorMessage += ": " + message;
    }

    console.error(chalk.redBright(shownErrorMessage));
    res.status(status).send(message);
};

const safeHandle = (res, err) => {
    const status = err?.isJoi ? 400 : err?.status || 500;
    const message = err?.details?.[0]?.message || err?.message || "Unexpected error";
    err.message = message;
    return handleError(res, status, err);
};

module.exports = { handleError, safeHandle };
