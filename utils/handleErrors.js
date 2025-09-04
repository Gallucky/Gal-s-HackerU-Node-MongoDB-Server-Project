const handleBadRequest = async (validator, error) => {
    const errorMessage = validator + " Error: " + error;
    error.message = errorMessage;
    error.status = error.status || 400;

    return Promise.reject(error);
};

const handleJoiError = async (error) => {
    const joiError = new Error(error.details[0].message);

    return handleBadRequest("Joi", joiError);
};

module.exports = { handleBadRequest, handleJoiError };
