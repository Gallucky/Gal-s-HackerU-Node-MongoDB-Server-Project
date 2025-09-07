const jwt = require("jsonwebtoken");
const config = require("config");

const key = config.get("JWT_KEY");

const generateAuthToken = (user) => {
    const { _id, isAdmin, isBusiness } = user;
    const token = jwt.sign({ _id, isAdmin, isBusiness }, key);
    return token;
};

const verifyToken = (token) => {
    try {
        const userData = jwt.verify(token, key);
        return userData;
    } catch (error) {
        console.error(error);
        return null;
    }
};

exports.generateAuthToken = generateAuthToken;
exports.verifyToken = verifyToken;
