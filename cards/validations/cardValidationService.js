const validateCardWithJoi = require("./joi/validateCardWithJoi");
const config = require("config");

const validator = config.get("VALIDATOR");

const validateCard = (card) => {
    if (validator === "Joi") {
        return validateCardWithJoi(card);
    }
};

module.exports = validateCard;
