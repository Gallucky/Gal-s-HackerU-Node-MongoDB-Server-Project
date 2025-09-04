const config = require("config");
const ENV = config.get("NODE_ENV");

const connectToDb = () => {
    if (ENV === "development") {
        require("./mongodb/connectLocally");
    }
    if (ENV === "production") {
        require("./mongodb/connectToAtlas");
    }
};

module.exports = connectToDb;
