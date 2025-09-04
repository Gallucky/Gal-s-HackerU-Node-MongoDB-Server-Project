const Joi = require("joi");

const validateCardWithJoi = (card) => {
    const urlRegex =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    const schema = Joi.object({
        title: Joi.string().min(2).max(256).required(),
        subtitle: Joi.string().min(2).max(256).required(),
        description: Joi.string().min(2).max(1024).required(),
        phone: Joi.string()
            .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
            .rule({ message: "card phone must be valid Israeli phone number" })
            .required(),
        web: Joi.string()
            .ruleset.regex(urlRegex)
            .rule({ message: "card web address must be valid url" })
            .allow(""),
        email: Joi.string()
            .ruleset.regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
            .rule({ message: "card email must be valid mail" })
            .required(),
        image: Joi.object().keys({
            url: Joi.string()
                .ruleset.regex(urlRegex)
                .rule({ message: "image card url address must be valid url" })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        }),
        address: Joi.object().keys({
            state: Joi.string().min(2).max(256).allow(""),
            country: Joi.string().min(2).max(256).required(),
            city: Joi.string().min(2).max(256).required(),
            street: Joi.string().min(2).max(256).required(),
            houseNumber: Joi.number().greater(0).required(),
            zip: Joi.number().min(1000).allow(0),
        }),
        bizNumber: Joi.number().allow(""),
        user_id: Joi.string().allow(""),
    });

    return schema.validate(card);
};

module.exports = validateCardWithJoi;
