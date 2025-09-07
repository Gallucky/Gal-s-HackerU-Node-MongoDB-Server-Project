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
const { auth } = require("../../auth/authService");
const Log = require("../../logger/loggers/customLogger");
const path = require("path");
const FILE_NAME = path.basename(__filename);

const location = (routeLocation) => `${FILE_NAME} | ${routeLocation}`;

//region | ------ Get ------ |

router.get("/", auth, async (req, res) => {
    Log.get(location("GetUsers"), "Get all users request has been received.");

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
});

router.get("/:id", auth, async (req, res) => {
    const id = req.params.id;
    Log.get(location("GetUserById"), `Get user by id request has been received.`);

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
});

//endregion | ------ Get ------ |

//region | ------ Post ------ |

router.post("/", async (req, res) => {
    Log.post(location("RegisterUser"), "Register request has been received.");

    try {
        const user = await registerUser(req.body);
        return res.status(201).send(user);
    } catch (error) {
        safeHandle(res, error);
    }
});

router.post("/login", async (req, res) => {
    Log.post(location("LoginUser"), "Login request has been received.");

    try {
        const user = await loginUser(req.body);
        return res.send(user);
    } catch (error) {
        safeHandle(res, error);
    }
});

//endregion | ------ Post ------ |

//region | ------ Put ------ |

router.put("/:id", auth, async (req, res) => {
    const id = req.params.id;
    Log.put(location("UpdateUser"), `Update user by id request has been received.`);

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
});

//endregion | ------ Put ------ |

//region | ------ Patch ------ |

router.patch("/:id", auth, async (req, res) => {
    const id = req.params.id;
    Log.patch(
        location("ChangeUserBusinessStatus"),
        `Change user business status request has been received.`
    );

    try {
        // The requesting user.
        const { _id } = req.user;
        if (_id !== id) {
            return handleError(
                res,
                403,
                new Error(
                    "Authorization Error: Access Denied - Only the given user can change this user's business status."
                )
            );
        }
        const user = await changeUserBusinessStatus(id);
        return res.send(user);
    } catch (error) {
        safeHandle(res, error);
    }
});

//endregion | ------ Patch ------ |

//region | ------ Delete ------ |

router.delete("/:id", auth, async (req, res) => {
    const id = req.params.id;
    Log.delete(location("DeleteUser"), `Delete user by id request has been received.`);

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
});

//endregion | ------ Delete ------ |

module.exports = router;
