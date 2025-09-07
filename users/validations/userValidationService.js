const loginValidation = require("./Joi/loginValidation");
const registerValidation = require("./Joi/registerValidation");
const userUpdateValidation = require("./Joi/userUpdateValidation");
const config = require("config");
const validator = config.get("VALIDATOR");

const validateRegistration = (user) => {
    if (validator === "Joi") {
        return registerValidation(user);
    }
};

const validateLogin = (user) => {
    if (validator === "Joi") {
        return loginValidation(user);
    }
};

module.exports = { validateRegistration, validateLogin };
