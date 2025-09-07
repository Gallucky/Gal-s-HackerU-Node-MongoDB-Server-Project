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
const { auth } = require("../../auth/authService");
const Log = require("../../logger/loggers/customLogger");
const path = require("path");
const FILE_NAME = path.basename(__filename);

const location = (routeLocation) => `${FILE_NAME} | ${routeLocation}`;

//region | ------ Get ------ |

// Get all cards route.
// Access / Authorization - All.
router.get("/", async (req, res) => {
    Log.get(location("GetAllCards"), "Get all cards request has been received.");

    try {
        const cards = await getCards();
        return res.send(cards);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }
});

// Getting all cards created by the requested user route.
// Access / Authorization - The registered user.
router.get("/my-cards", auth, async (req, res) => {
    Log.get(location("GetMyCards"), "Get all of my cards request has been received.");

    try {
        const userId = req.user._id;

        const card = await getMyCards(userId);
        res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }
});

// Getting a specific card route.
// Access / Authorization - All.
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    Log.get(location("GetCard"), "Get a specific card request has been received.");

    try {
        const card = await getCard(id);
        res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }
});

//endregion | ------ Get ------ |

//region | ------ Post ------ |

// Creating a card route.
// Access / Authorization - Business accounts.
router.post("/", auth, async (req, res) => {
    Log.post(location("CreateCard"), "Create card request has been received.");
    try {
        const { isBusiness, _id } = req.user;
        if (!isBusiness) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Only business accounts can create cards."
                )
            );
        }
        const card = await createCard(req.body, _id);
        res.status(201).send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }
});

//endregion | ------ Post ------ |

//region | ------ Put ------ |

// Update card route.
// Access / Authorization: The user that created the card.
router.put("/:id", auth, async (req, res) => {
    Log.put(location("UpdateCard"), "Update card request has been received.");

    try {
        const cardId = req.params.id;
        const userId = req.user._id;
        const rawCard = req.body;

        if (!rawCard) {
            return handleError(
                res,
                400,
                new Error("Bad Request Error: No updated card object data provided.")
            );
        }

        // Getting the card by it's id to get the user's id that created it.
        const currentCard = await getCard(cardId);
        const cardUserId = await currentCard.user_id;

        // Checking the value only because, userId is of type string and cardUserId is of type objectId.
        // Another way is to use the following condition: String(userId) !== String(cardUserId).
        // String() is null/undefined safe that's why it is recommended in this case instead of .toString().
        if (userId != cardUserId) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Only the user who created this card can edit it."
                )
            );
        }

        const card = await updateCard(cardId, rawCard);
        res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }
});

//endregion | ------ Put ------ |

//region | ------ Patch ------ |

router.patch("/:id", auth, async (req, res) => {
    const id = req.params.id;
    const userId = "123456";

    try {
        const card = await likeCard(id, userId);
        res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error);
    }
});

//endregion | ------ Patch ------ |

//region | ------ Delete ------ |

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
});

//endregion | ------ Delete ------ |

// Exporting the updated router object.
module.exports = router;
