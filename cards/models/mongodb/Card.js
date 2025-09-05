const mongoose = require("mongoose");

const ImageSchema = require("./Image");
const AddressSchema = require("./Address");
const {
    DEFAULT_VALIDATION,
    URL,
    EMAIL,
    PHONE,
    CREATED_AT,
} = require("../../helpers/commonValidations");

const CardsSchema = new mongoose.Schema({
    title: DEFAULT_VALIDATION,
    subtitle: DEFAULT_VALIDATION,
    description: {
        ...DEFAULT_VALIDATION,
        maxLength: 1024,
    },
    phone: PHONE,
    email: EMAIL,
    web: URL,
    image: ImageSchema,
    address: AddressSchema,
    bizNumber: {
        type: Number,
        minLength: 1,
        maxLength: 9,
        required: true,
        trim: true,
    },
    createdAt: CREATED_AT,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    likes: [String],
});

const Card = mongoose.model("Cards", CardsSchema);
module.exports = Card;
