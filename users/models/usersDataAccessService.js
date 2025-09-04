const { handleBadRequest } = require("../../utils/handleErrors");
const User = require("./mongodb/User");
const _ = require("lodash");
const { comparePassword } = require("../helpers/bcrypt");
const config = require("config");
const { generateAuthToken } = require("../../auth/Providers/jwt");
const DB = config.get("DB");

// Lesson 7 - Exercise 7 //
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

            const validPassword = comparePassword(password, user.password);

            if (!validPassword) {
                throw new Error("Authentication Error: Invalid Password");
            }

            const token = generateAuthToken(user);
            return Promise.resolve(token);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("user created not in mongodb!");
};

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

// Lesson 7 - Exercise 8 //
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

exports.remove = async (userId) => {
    if (DB === "MONGODB") {
        try {
            const user = await User.findOneAndDelete(
                userId,
                { password: 0, __v: 0 },
                { new: true }
            );

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
