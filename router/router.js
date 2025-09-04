const express = require("express");
const router = express.Router();
const cardsController = require("../cards/routes/cardController");
const usersController = require("../users/routes/usersController");
const { handleError } = require("../utils/errorHandler");

// Development - http://localhost:8181/cards/...
// Production - http://localhost:9191/cards/...
router.use("/cards", cardsController);

// Development - http://localhost:8181/users/...
// Production - http://localhost:9191/users/...
router.use("/users", usersController);

router.use((req, res) => handleError(res, 404, new Error("Page/Route not Found!")));

module.exports = router;
