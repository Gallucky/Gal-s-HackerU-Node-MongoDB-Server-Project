const Card = require("../models/mongodb/Card");
const _ = require("lodash");
const { handleBadRequest } = require("../../utils/handleErrors");

const generateBizNumber = async () => {
    try {
        const random = _.random(1000000, 9000000);
        const card = await Card.findOne({
            bizNumber: { $eq: random },
        });

        if (card) {
            return generateBizNumber();
        }

        return random;
    } catch (error) {
        error.status = 404;
        return handleBadRequest("GenerateBizNumber", error);
    }
};

module.exports = generateBizNumber;
