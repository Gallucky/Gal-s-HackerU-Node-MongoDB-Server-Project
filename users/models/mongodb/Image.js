const mongoose = require("mongoose");
const { URL, DEFAULT_VALIDATION } = require("../../helpers/commonValidations");

const ImageSchema = new mongoose.Schema({
    url: URL,
    alt: DEFAULT_VALIDATION,
});

module.exports = ImageSchema;
