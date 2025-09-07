/* eslint-disable no-useless-escape */
const Joi = require("joi");

const registerValidation = (user) => {
    const urlRegex =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    const schema = Joi.object({
        name: Joi.object({
            first: Joi.string().min(2).max(256).required(),
            middle: Joi.string().min(2).max(256).allow(""),
            last: Joi.string().min(2).max(256).required(),
        }),
        isAdmin: Joi.boolean().default(false),
        isBusiness: Joi.boolean().default(false),
        phone: Joi.string()
            .pattern(/^0\d{1,2}-?\s?\d{3}\s?\d{4}$/)
            .message("card phone must be valid Israeli phone number")
            .required(),
        email: Joi.string()
            .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
            .message("Email must be a valid email address.")
            .required(),
        password: Joi.string()
            .pattern(/^(?=.{9,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\-&\^%$#@!]).+$/)
            .message(
                "The password must be at least 9 characters long and must contain each of the following: uppercase letter, lowercase letter, a digit, one unique characters: -&^%$#@!"
            )
            .required(),
        image: Joi.object()
            .keys({
                url: Joi.string()
                    .ruleset.regex(urlRegex)
                    .rule({ message: "The image url address must be a valid url address." })
                    .allow(""),
                alt: Joi.string().min(2).max(256).allow(""),
            })
            .required(),
        address: Joi.object({
            state: Joi.string().min(2).max(256).allow(""),
            country: Joi.string().min(2).max(256).required(),
            city: Joi.string().min(2).max(256).required(),
            street: Joi.string().min(2).max(256).required(),
            houseNumber: Joi.number().greater(0).required(),
            zip: Joi.number().min(1000).allow(0),
        }),
    }).options({ stripUnknown: true });

    return schema.validate(user);
};

module.exports = registerValidation;
