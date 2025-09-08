const { handleBadRequest } = require("../../utils/handleErrors");
const User = require("./mongodb/User");
const _ = require("lodash");
const { comparePassword } = require("../helpers/bcrypt");
const config = require("config");
const { generateAuthToken } = require("../../auth/Providers/jwt");
const DB = config.get("DB");

//region | ###### Get ###### |

exports.find = async () => {
    if (DB === "MONGODB") {
        try {
            const users = await User.find(
                {},
                {
                    password: 0,
                    __v: 0,
                }
            );

            return Promise.resolve(users);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve([]);
};

exports.findOne = async (userId) => {
    if (DB === "MONGODB") {
        try {
            const user = await User.findById(userId, {
                password: 0,
                __v: 0,
            });

            if (!user) {
                throw new Error("Could not find this user in the database");
            }

            return Promise.resolve(user);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};

//endregion | ###### Get ###### |

//region | ###### Post ###### |

exports.register = async (normalizedUser) => {
    if (DB === "MONGODB") {
        try {
            const { email } = normalizedUser;
            let user = await User.findOne({ email });

            if (user) {
                throw new Error("User is already registered");
            }

            user = await User(normalizedUser);
            user = await user.save();
            user = _.pick(user, ["_id", "name", "email"]);
            return Promise.resolve(user);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("user created not in mongodb!");
};

exports.login = async (normalizedUser) => {
    if (DB === "MONGODB") {
        try {
            const { email, password } = normalizedUser;
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error("Authentication Error: Invalid Email");
            }

            // Checking if the user is blocked.
            if (user.blocked) {
                // Unblocking user after 24 hours.
                const BLOCK_DURATION_HOURS = 24;
                const now = new Date();
                if (
                    user.lastBlockedAt &&
                    now - user.lastBlockedAt > BLOCK_DURATION_HOURS * 60 * 60 * 1000
                ) {
                    user.blocked = false;
                    user.strikes = 0;
                    await user.save();
                } else {
                    const error = new Error("The user is blocked. Try again later.");
                    error.status = 403;
                    throw error;
                }
            }

            const validPassword = comparePassword(password, user.password);

            if (!validPassword) {
                // Add strike.
                user.strikes = (user.strikes || 0) + 1;

                // If the strikes is equal or greater than the threshold then blocking the user.
                const STRIKES_THRESHOLD = 3;
                if (user.strikes >= STRIKES_THRESHOLD) {
                    user.blocked = true;
                    user.lastBlockedAt = new Date();
                }

                await user.save();

                throw new Error("Authentication Error: Invalid Password");
            } else {
                // Resetting strikes on successful login!
                user.strikes = 0;
                await user.save();
            }

            const token = generateAuthToken(user);
            return Promise.resolve(token);
        } catch (error) {
            error.status = error.status || 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("user created not in mongodb!");
};

//endregion | ###### Post ###### |

//region | ###### Put ###### |

exports.update = async (userId, normalizedUser) => {
    if (DB === "MONGODB") {
        try {
            let user = await User.findByIdAndUpdate(
                userId,
                { $set: normalizedUser },
                { new: true }
            ).select("-password -__v");

            if (!user) {
                throw new Error(
                    "Could not update this user because a user with this ID cannot be found in the database"
                );
            }

            return Promise.resolve(user);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("mongoose", error);
        }
    }
    return Promise.resolve("User updated not in mongodb");
};

//endregion | ###### Put ###### |

//region | ###### Patch ###### |

exports.changeIsBizStatus = async (userId) => {
    if (DB === "MONGODB") {
        try {
            const pipeline = [
                {
                    $set: {
                        isBusiness: { $not: "$isBusiness" },
                    },
                },
            ];

            const user = await User.findByIdAndUpdate(userId, pipeline, { new: true }).select([
                "-password",
                "-__v",
            ]);

            if (!user) {
                throw new Error(
                    "Could not change user isBusiness status because a user with this ID cannot be found in the database"
                );
            }

            return Promise.resolve(user);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("card updated!");
};

//endregion | ###### Patch ###### |

//region | ###### Delete ###### |

exports.remove = async (userId) => {
    if (DB === "MONGODB") {
        try {
            const user = await User.findOneAndDelete({ _id: userId }).select("-password -__v");

            if (!user) {
                throw new Error(
                    "Could not delete this user because a user with this ID cannot be found in the database"
                );
            }

            return Promise.resolve(user);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("user deleted not in mongodb!");
};

//endregion | ###### Delete ###### |
