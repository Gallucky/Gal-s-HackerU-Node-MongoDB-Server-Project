const { verifyToken } = require("./Providers/jwt");
const { handleError } = require("../utils/errorHandler");
const config = require("config");

const tokenGenerator = config.get("TOKEN_GENERATOR") || "jwt";

const auth = (req, res, next) => {
    if (tokenGenerator === "jwt") {
        try {
            const tokenFromClient = req.header("x-auth-token");
            if (!tokenFromClient) {
                throw new Error("Authentication Error: Please Login/Authenticate");
            }

            const userData = verifyToken(tokenFromClient);
            if (!userData) {
                throw new Error("Authentication Error: Unauthorized User");
            }

            req.user = userData;
            return next();
        } catch (error) {
            return handleError(res, 401, error);
        }
    }
    const err = new Error("Use jwt!");
    return handleError(res, 500, err);
};

exports.auth = auth;
