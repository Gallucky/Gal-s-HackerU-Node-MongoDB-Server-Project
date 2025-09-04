const loginValidation = require("./Joi/loginValidation");
const registerValidation = require("./Joi/registerValidation");
const userUpdateValidation = require("./Joi/userUpdateValidation");

const validator = undefined || "Joi";

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
