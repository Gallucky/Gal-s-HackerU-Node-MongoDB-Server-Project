const chalk = require("chalk");
const express = require("express");
const router = express.Router();
const { safeHandle, handleError } = require("../../utils/errorHandler");
const {
    getUsers,
    getUser,
    loginUser,
    changeUserBusinessStatus,
    deleteUser,
    updateUser,
    registerUser,
} = require("../services/usersService");
const controllerName = "usersController";
const currentDate = require("../../utils/timeStamp");
const { auth } = require("../../auth/authService");
const Log = require("../../logger/loggers/customLogger");

// Get
router.get("/", auth, async (req, res) => {
    try {
        const { isAdmin } = req.user;

        if (!isAdmin) {
            return handleError(
                res,
                403,
                new Error("Authorization Error: Access Denied for non admin users!")
            );
        }

        const users = await getUsers();
        return res.send(users);
    } catch (error) {
        safeHandle(res, error);
    }

    // Lesson 6 - Exercise 3 //
    console.log(
        chalk.blue(
            `${currentDate()} [server] [${controllerName}] Get from users | url: "${req.url}"`
        )
    );
});

router.get("/:id", auth, async (req, res) => {
    const id = req.params.id;

    try {
        const { _id, isAdmin } = req.user;
        if (_id !== id && !isAdmin) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Access is for the given user and admin users!"
                )
            );
        }
        const user = await getUser(id);
        return res.send(user);
    } catch (error) {
        safeHandle(res, error);
    }

    // Lesson 6 - Exercise 3 //
    console.log(
        chalk.blue(
            `${currentDate()} [server] [${controllerName}] Get from users with ID: ${id} | url: "${
                req.url
            }"`
        )
    );
});

// Post (Create)
router.post("/", async (req, res) => {
    try {
        Log.post("usersController.js", "User registration request received.");
        const user = await registerUser(req.body);
        return res.status(201).send(user);
    } catch (error) {
        safeHandle(res, error);
    }
});

router.post("/login", async (req, res) => {
    try {
        Log.post("usersController.js", "Login request received.");
        const user = await loginUser(req.body);
        return res.send(user);
    } catch (error) {
        safeHandle(res, error);
    }

    // Lesson 6 - Exercise 3 //
    console.log(
        chalk.blue(
            `${currentDate()} [server] [${controllerName}] Post from users with login | url: "${
                req.url
            }"`
        )
    );
});

// Put (Update)
router.put("/:id", auth, async (req, res) => {
    const id = req.params.id;

    try {
        const { _id } = req.user;
        if (_id !== id) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Only the user can update his/her information."
                )
            );
        }
        const user = await updateUser(id, req.body);
        return res.send(user);
    } catch (error) {
        safeHandle(res, error);
    }

    // Lesson 6 - Exercise 3 //
    console.log(
        chalk.blue(
            `${currentDate()} [server] [${controllerName}] Put to user with ID: ${id} | url: "${
                req.url
            }"`
        )
    );
});

// Patch
router.patch("/:id", auth, async (req, res) => {
    const id = req.params.id;
    try {
        const { _id, isAdmin } = req.user;
        if (_id !== id && !isAdmin) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Only the given user or an admin user can change this user's business status."
                )
            );
        }
        const user = await changeUserBusinessStatus(id);
        return res.send(user);
    } catch (error) {
        safeHandle(res, error);
    }
    // Lesson 6 - Exercise 4 //
    console.log(
        chalk.hex("#800080")(
            `${currentDate()} [server] [${controllerName}] Patch from users with id: ${id} | url: "${
                req.url
            }"`
        )
    );
});

// Delete
router.delete("/:id", auth, async (req, res) => {
    const id = req.params.id;

    try {
        const { _id, isAdmin } = req.user;
        if (_id !== id && !isAdmin) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Only the given user or an admin user can delete this user's account."
                )
            );
        }
        const user = await deleteUser(id);
        return res.send(user);
    } catch (error) {
        safeHandle(res, error);
    }
    // Lesson 6 - Exercise 4 //
    console.log(
        chalk.hex("#FF4500")(`${currentDate()} [server] [${controllerName}] in user delete!`)
    );
});

module.exports = router;
