const {
    find,
    findMyCards,
    findOne,
    create,
    update,
    like,
    remove,
    updateBizNumber,
} = require("../models/cardsDataAccessService");
const validateCard = require("../validations/cardValidationService");
const normalizeCard = require("../helpers/normalizeCard");
const { handleJoiError } = require("../../utils/handleErrors");

//region | ====== Get ====== |

// Get all cards route.
// Access / Authorization - All.
exports.getCards = async () => {
    try {
        const cards = await find();
        return Promise.resolve(cards);
    } catch (error) {
        return Promise.reject(error);
    }
};

// Getting all cards created by the requested user route.
// Access / Authorization - The registered user.
exports.getMyCards = async (userId) => {
    try {
        const card = await findMyCards(userId);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

// Getting a specific card route.
// Access / Authorization - All.
exports.getCard = async (cardId) => {
    try {
        const card = await findOne(cardId);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Get ====== |

//region | ====== Post ====== |

// Creating a card route.
// Access / Authorization - Business accounts.
exports.createCard = async (rawCard, userId) => {
    try {
        const { error } = validateCard(rawCard);
        if (error) return handleJoiError(error);

        let card = await normalizeCard(rawCard, userId);
        card = create(card);

        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Post ====== |

//region | ====== Put ====== |

// Update card route.
// Access / Authorization: The user that created the card.
exports.updateCard = async (cardId, rawCard) => {
    const { error } = validateCard(rawCard);
    if (error) return handleJoiError(error);

    try {
        let card = await normalizeCard(rawCard);
        card = await update(cardId, card);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Put ====== |

//region | ====== Patch ====== |

exports.likeCard = async (cardId, userID) => {
    try {
        const card = await like(cardId, userID);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.changeBizNumber = async (cardId) => {
    try {
        const card = await updateBizNumber(cardId);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Patch ====== |

//region | ====== Delete ====== |

exports.deleteCard = async (id) => {
    try {
        const card = await remove(id);
        return Promise.resolve(card);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Delete ====== |
