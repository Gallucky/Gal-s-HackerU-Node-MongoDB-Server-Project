const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("../../helpers/commonValidations");

const AddressSchema = new mongoose.Schema({
    state: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return v.length === 0 || (v.length >= 2 && v.length <= 256);
            },
            message: "Value must be empty or between 2 and 256 characters",
        },
    },
    country: DEFAULT_VALIDATION,
    city: DEFAULT_VALIDATION,
    street: DEFAULT_VALIDATION,
    houseNumber: {
        type: Number,
        required: true,
        minLength: 1,
        trim: true,
    },
    zip: {
        type: Number,
        minLength: 4,
        trim: true,
        default: 0,
    },
});

module.exports = AddressSchema;
