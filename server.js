const express = require("express");
const app = express();
const chalk = require("chalk");
const router = require("./router/router");
const cors = require("./middlewares/cors");
const logger = require("./logger/loggerService");
const { handleError } = require("./utils/errorHandler");
const currentDate = require("./utils/timeStamp");
const connectToDb = require("./DB/dbService");
const config = require("config");
const { generateInitialUsers, generateInitialCards } = require("./initialData/initialDataService");

// Middleware - App Level.
app.use(cors);
app.use(logger);
app.use(express.json());
app.use(express.text());
app.use(express.static("./public"));
app.use(router);

// Error Handler Middleware
app.use((err, req, res, next) => {
    handleError(res, err.status || 500, err.message);
});

const PORT = config.get("PORT");
app.listen(PORT, () => {
    console.log(`\n${currentDate()} [server] Listening... Port: ${PORT}`);
    connectToDb();
    generateInitialUsers();
    generateInitialCards();
});
