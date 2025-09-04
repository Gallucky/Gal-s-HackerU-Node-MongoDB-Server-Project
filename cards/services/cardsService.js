const {
    find,
    findMyCards,
    findOne,
    create,
    update,
    like,
    remove,
} = require("../models/cardsDataAccessService");
const validateCard = require("../validations/cardValidationService");
const normalizeCard = require("../helpers/normalizeCard");

// Lesson 7 - Exercise 3 //

exports.getCards = async () => {
    try {
        const cards = await find();
        return Promise.resolve(cards);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.getMyCards = async (userId) => {
    try {
        const card = await findMyCards(userId);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.getCard = async (cardId) => {
    try {
        const card = await findOne(cardId);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.createCard = async (rawCard) => {
    try {
        const { error } = validateCard(rawCard);

        if (error) {
            return Promise.reject(error);
        }

        let card = await normalizeCard(rawCard);
        card = create(card);

        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

// Lesson 7 - Exercise 4 //
exports.updateCard = async (cardId, rawCard) => {
    try {
        let card = { ...rawCard };
        card = await normalizeCard(card);
        card = await update(cardId, card);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.likeCard = async (cardId, userID) => {
    try {
        const card = await like(cardId, userID);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.deleteCard = async (id) => {
    try {
        const card = await remove(id);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};
