const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");

const DB_NAME = config.get("DB_NAME");
const DB_PASS = config.get("DB_PASSWORD");

mongoose
    .connect(`mongodb+srv://${DB_NAME}:${DB_PASS}@cluster0.q7wd5ov.mongodb.net/`)
    .then(() => console.info(chalk.magentaBright("Connect To Atlas MongoDB!")))
    .catch((error) => {
        console.error(chalk.redBright(error));
    });
