const { verifyToken } = require("./Providers/jwt");
const { handleError } = require("../utils/errorHandler");
const config = require("config");
const { getUser } = require("../users/services/usersService");

const tokenGenerator = config.get("TOKEN_GENERATOR") || "jwt";

const auth = async (req, res, next) => {
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

            // Trying to fetch the user to check if it is blocked.
            try {
                const user = await getUser(userData._id);
                if (!user) {
                    return handleError(res, 404, new Error("Authentication Error: User not found"));
                }
                if (user.blocked) {
                    return handleError(res, 403, new Error("The user is blocked. Try again later"));
                }
            } catch (error) {
                return handleError(res, 500, error);
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
