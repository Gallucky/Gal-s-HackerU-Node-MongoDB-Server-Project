const {
    register,
    login,
    find,
    findOne,
    update,
    changeIsBizStatus,
    remove,
} = require("../models/usersDataAccessService");
const { validateRegistration, validateLogin } = require("../validations/userValidationService");
const normalizeUser = require("../helpers/normalizeUser");
const { generateUserPassword } = require("../helpers/bcrypt");

//region | ====== Get ====== |

exports.getUsers = async () => {
    try {
        const users = await find();
        return Promise.resolve(users);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.getUser = async (userId) => {
    try {
        const user = await findOne(userId);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Get ====== |

//region | ====== Post ====== |

exports.registerUser = async (rawUser) => {
    try {
        const { error } = validateRegistration(rawUser);

        if (error) {
            return Promise.reject(error);
        }

        let user = normalizeUser(rawUser);
        user.password = generateUserPassword(user.password);
        user = register(user);

        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.loginUser = async (user) => {
    try {
        const { error } = validateLogin(user);

        if (error) {
            return Promise.reject(error);
        }

        user = await login(user);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Post ====== |

//region | ====== Put ====== |

exports.updateUser = async (userId, rawUser) => {
    try {
        let user = normalizeUser(rawUser);
        user = await update(userId, user);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Put ====== |

//region | ====== Patch ====== |

exports.changeUserBusinessStatus = async (userId) => {
    try {
        const user = await changeIsBizStatus(userId);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Patch ====== |

//region | ====== Delete ====== |

exports.deleteUser = async (userId) => {
    try {
        const user = await remove(userId);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

//endregion | ====== Delete ====== |
