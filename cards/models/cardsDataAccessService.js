const { handleBadRequest } = require("../../utils/handleErrors");
const Card = require("./mongodb/Card");
const config = require("config");
const DB = config.get("DB");

// Lesson 7 - Exercise 1 //

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

// Returns the user's created cards in an array.
exports.findMyCards = async (userId) => {
    if (DB === "MONGODB") {
        try {
            return Promise.resolve(`my cards: ${userId}`);
        } catch (error) {
            error.status = 404;
            return Promise.reject(error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};

// Returns the card with the given id.
exports.findOne = async (cardID) => {
    if (DB === "MONGODB") {
        try {
            const cards = await Card.findById(cardID);
            if (!cards) {
                throw new Error("Could not find this card in the database");
            }

            return Promise.resolve(cards);
        } catch (error) {
            // Card with that id was not found.
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve({});
};

// Returns back the object with the _id property added.
exports.create = async (normalizedCard) => {
    if (DB === "MONGODB") {
        try {
            let card = new Card(normalizedCard);
            card = await card.save();
            return Promise.resolve(card);
        } catch (error) {
            // Card with that id was not found.
            error.status = 400;
            return Promise.reject(error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};

// Lesson 7 - Exercise 2 //

// Updates a card.
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
