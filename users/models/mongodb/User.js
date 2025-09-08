const mongoose = require("mongoose");

const ImageSchema = require("./Image");
const AddressSchema = require("./Address");
const NameSchema = require("./Name");
const { EMAIL, PHONE, CREATED_AT } = require("../../helpers/commonValidations");

const UserSchema = new mongoose.Schema({
    name: NameSchema,
    phone: PHONE,
    email: EMAIL,
    password: {
        type: String,
        required: true,
        match: RegExp(/^(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{9,}$/),
    },
    image: ImageSchema,
    address: AddressSchema,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBusiness: {
        type: Boolean,
        default: false,
    },
    createdAt: CREATED_AT,
    blocked: {
        type: Boolean,
        default: false,
    },
    strikes: {
        type: Number,
        default: 0,
    },
    lastBlockedAt: {
        type: Date,
        default: null,
    },
});

const User = mongoose.model("Users", UserSchema);
module.exports = User;
