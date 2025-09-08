const { handleBadRequest } = require("../../utils/handleErrors");
const generateBizNumber = require("../helpers/generateBizNumber");
const Card = require("./mongodb/Card");
const config = require("config");
const DB = config.get("DB");

//region | ###### Get ###### |

// Get all cards route.
// Access / Authorization - All.
// Returns all the cards in an array.
exports.find = async () => {
    if (DB === "MONGODB") {
        try {
            const cards = await Card.find();
            return Promise.resolve(cards);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }

    return Promise.resolve([]);
};

// Getting all cards created by the requested user route.
// Access / Authorization - The registered user.
// Returns the user's created cards in an array.
exports.findMyCards = async (userId) => {
    if (DB === "MONGODB") {
        try {
            const cards = await Card.find({ user_id: { $eq: userId } });
            return Promise.resolve(cards);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};

// Getting a specific card route.
// Access / Authorization - All.
// Returns the card with the given id.
exports.findOne = async (cardID) => {
    if (DB === "MONGODB") {
        try {
            const card = await Card.findById(cardID);
            if (!card) {
                throw new Error("Could not find this card in the database");
            }

            return Promise.resolve(card);
        } catch (error) {
            // Card with that id was not found.
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve({});
};

//endregion | ###### Get ###### |

//region | ###### Post ###### |

// Creating a card route.
// Access / Authorization - Business accounts.
// Returns back the object with the _id property added.
exports.create = async (normalizedCard) => {
    if (DB === "MONGODB") {
        try {
            let card = new Card(normalizedCard);
            card = await card.save();
            return Promise.resolve(card);
        } catch (error) {
            // If the error code represent a duplicate unique key value.
            if (error.code === 11000) {
                const uniqueFieldDup = Object.keys(error.keyPattern)[0];
                const value = error.keyValue[uniqueFieldDup];
                error.message = `The email '${value}' is already in use.`;
            }
            error.status = 400;
            return Promise.reject(error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};

//endregion | ###### Post ###### |

//region | ###### Put ###### |

/** Update card route.
    
    Access / Authorization: The user that created the card.
    
    The function will get a card id and a normalized card object.
    
    It will search in the database for a card with the given id.
    
    If it found a card with the same id then it will update the card with,
    all of the data in the `normalizeCard` param object.
    
    Otherwise the card will return a promise rejection.
*/
exports.update = async (cardId, normalizedCard) => {
    if (DB === "MONGODB") {
        try {
            const card = await Card.findByIdAndUpdate(cardId, normalizedCard, { new: true });

            if (!card) {
                throw new Error(
                    "Could not update this card because a card with this ID cannot be found in the database"
                );
            }

            return Promise.resolve(card);
        } catch (error) {
            // Card with that id was not found.
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("card deleted not in mongodb!");
};

//endregion | ###### Put ###### |

//region | ###### Patch ###### |

// Likes a card.
exports.like = async (cardId, userId) => {
    if (DB === "MONGODB") {
        try {
            let card = await Card.findById(cardId);

            if (!card) {
                throw new Error(
                    "Could not change card likes because a card with this ID cannot be found in the database"
                );
            }

            if (card.likes.includes(userId)) {
                // The card is already liked, removing like.
                card.likes = card.likes.filter((id) => id !== userId);
            } else {
                // The card is not liked, adding like.
                card.likes.push(userId);
            }

            card = await card.save();
            return Promise.resolve(card);
        } catch (error) {
            // Card with that id was not found.
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("card updated!");
};

// Regenerates the card's bizNumber.
exports.updateBizNumber = async (cardId) => {
    if (DB === "MONGODB") {
        try {
            let card = await Card.findById(cardId);

            if (!card) {
                throw new Error(
                    "Could not change card business number because a card with this ID cannot be found in the database"
                );
            }

            // Generating the new business number for the card.
            // The method already checks if it generated an already in use
            // business number and if that's the case it will call itself
            // recursively to try and generate again.
            card.bizNumber = await generateBizNumber();
            await card.save();
            return Promise.resolve(card);
        } catch (error) {
            // Card with that id was not found.
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    } else {
        return Promise.resolve("Card business number updated / changed not in mongodb.");
    }
};

//endregion | ###### Patch ###### |

//region | ###### Delete ###### |

// Removes a card.
exports.remove = async (cardId) => {
    if (DB === "MONGODB") {
        try {
            let card = await Card.findByIdAndDelete(cardId);

            if (!card) {
                throw new Error(
                    "Could not delete this card because a card with this ID cannot be found in the database"
                );
            }

            return Promise.resolve(card);
        } catch (error) {
            // Card with that id was not found.
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("card deleted not in mongodb!");
};

//endregion | ###### Delete ###### |
