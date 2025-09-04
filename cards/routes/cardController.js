const chalk = require("chalk");
const express = require("express");
const { handleError } = require("../../utils/errorHandler");
const router = express.Router();
const {
    getCards,
    getMyCards,
    getCard,
    createCard,
    updateCard,
    likeCard,
    deleteCard,
} = require("../services/cardsService");
const currentDate = require("../../utils/timeStamp");
const { auth } = require("../../auth/authService");

const controllerName = "cardController";

// Get
router.get("/", async (req, res) => {
    // Lesson 6 - Exercise 1 //
    console.log(
        chalk.green(
            `${currentDate()} [server] [${controllerName}] Get from cards | url: "${req.url}"`
        )
    );

    // Lesson 7 - Exercise 5 //
    try {
        const cards = await getCards();
        return res.send(cards);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }

    // res.send(`[${controllerName}] Get from cards | url: "${req.url}"`);
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const card = await getCard(id);
        res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }

    // Lesson 6 - Exercise 1 //
    console.log(
        chalk.green(
            `${currentDate()} [server] [${controllerName}] Get a card with id: ${id} | url: "${
                req.url
            }"`
        )
    );
    // res.send(`[${controllerName}] Get a card with id: ${id} | url: "${req.url}"`);
});

router.get("/my-cards", async (req, res) => {
    try {
        const userId = "adminID";
        const card = await getMyCards(userId);
        res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }
});

// Post / Create
router.post("/", auth, async (req, res) => {
    try {
        const { isBusiness } = req.user;
        if (!isBusiness) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Only business accounts can create cards."
                )
            );
        }
        const card = await createCard(req.body);
        res.status(201).send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }

    // Lesson 6 - Exercise 1 //
    console.log(
        chalk.blue(
            `${currentDate()} [server] [${controllerName}] Post (Create) a card | url: "${req.url}"`
        )
    );
    // res.send(`[${controllerName}] Post (Create) a card | url: "${req.url}"`);
});

// Put / Update
router.put("/:id", auth, async (req, res) => {
    const id = req.params.id;

    try {
        const { _id } = req.user;
        const cardUserCreatorId = req.body.user_id;
        if (_id !== cardUserCreatorId) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Only the user who created this card can edit it."
                )
            );
        }
        const card = await updateCard(id, req.body);
        res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }

    // Lesson 6 - Exercise 1 //
    console.log(
        chalk.magenta(
            `${currentDate()} [server] [${controllerName}] Put (Update) a card with id: ${id} | url: "${
                req.url
            }"`
        )
    );
    // res.send(`[${controllerName}] Put (Update) a card with id: ${id} | url: "${req.url}"`);
});

// Patch
router.patch("/:id", auth, async (req, res) => {
    const id = req.params.id;
    const userId = "123456";

    try {
        const card = await likeCard(id, userId);
        res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }

    // Lesson 6 - Exercise 2 //
    console.log(
        chalk.hex("#800080")(
            `[${controllerName}] Patch from cards with id: ${id} | url: "${req.url}"`
        )
    );

    // res.send(`[${controllerName} Patch from cards with id: ${id} | url: "${req.url}"]`);
});

// Delete
router.delete("/:id", auth, async (req, res) => {
    const id = req.params.id;

    try {
        const { _id, isAdmin } = req.user;
        const cardUserCreatorId = req.user.user_id;
        if (_id !== cardUserCreatorId && !isAdmin) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Only the user who created this card or an admin user can delete this card."
                )
            );
        }
        const card = await deleteCard(id);
        res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }

    // Lesson 6 - Exercise 2 //
    console.log(
        chalk.hex("#FF4500")(
            `[${controllerName}] Delete from cards using id: ${id} | url: "${req.url}"`
        )
    );

    // res.send(`[${controllerName}] Delete from cards using id: ${id} | url: "${req.url}"`);
});

// Exporting the updated router object.
module.exports = router;
