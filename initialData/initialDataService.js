const data = require("./initialData.json");
const normalizeUser = require("../users/helpers/normalizeUser");
const normalizeCard = require("../cards/helpers/normalizeCard");
const { register } = require("../users/models/usersDataAccessService");
const { create } = require("../cards/models/cardsDataAccessService");
const { generateUserPassword } = require("../users/helpers/bcrypt");
const chalk = require("chalk");
const getCurrentTimeStampFormatted = require("../utils/timeStamp");
const { handleError } = require("../utils/errorHandler");
const getLocationFromErrorStack = require("../utils/getLocationFormatted");
const Card = require("../cards/models/mongodb/Card");
const User = require("../users/models/mongodb/User");

// Generating default cards.
const generateInitialCards = async () => {
    // Getting default cards data.
    const { cards } = data;
    cards.forEach(async (card) => {
        // Foreach card trying to create it.
        try {
            // Creating default cards using this id.
            const userId = "68b097cc5510cdf63db096b5";

            if (checkInitialCard(card.email)) {
                // Breaking before trying to create the card.
                // The email is already in use.
                // Thus the initial card is already created in the database most likely.
                // Or different card entirely is in the database with the initial card's email address.
                const timeStamp = getCurrentTimeStampFormatted();
                return console.log(
                    chalk.yellowBright(
                        timeStamp +
                            ` [initialDataService.js] [Card]: The initial card's email is already in use.`
                    )
                );
            }

            card = await normalizeCard(card, userId);
            await create(card);
            return;
        } catch (error) {
            // If error occurs get the current timestamp and print the error.
            // Usually if the data already exists in the database.
            const timeStamp = getCurrentTimeStampFormatted();
            return console.log(
                chalk.redBright(timeStamp + ` [initialDataService.js]: ` + error.message)
            );
        }
    });
};

// Generating default users.
const generateInitialUsers = async () => {
    // Extracting the users data.
    const { users } = data;
    // Foreach initial user trying to create it.
    users.forEach(async (user) => {
        try {
            if (checkInitialUser(user.email)) {
                // Breaking before attempting to register the initial user.
                // Because the email is already in use.
                const timeStamp = getCurrentTimeStampFormatted();
                return console.log(
                    chalk.yellowBright(
                        timeStamp +
                            ` [initialDataService.js] [User]: The initial user's email is already in use.`
                    )
                );
            }
            user = await normalizeUser(user);
            // Encrypting the password of the current initial user.
            user.password = generateUserPassword(user.password);
            await register(user);
            return;
        } catch (error) {
            // If error occurs get the current timestamp and print the error.
            // Usually if the data already exists in the database.
            const timeStamp = getCurrentTimeStampFormatted();
            return console.log(
                chalk.redBright(timeStamp + ` [initialDataService.js]: ` + error.message)
            );
        }
    });
};

// Getting an email and checking if a card is already using this email address.
const checkInitialCard = async (cardEmail) => {
    try {
        let emailUsed = await Card.findOne({ email: cardEmail });

        // If emailUsed is not falsy value then a card was found.
        return emailUsed ? true : false;
    } catch {
        // If error occurs get the current timestamp and print the error.
        const timeStamp = getCurrentTimeStampFormatted();
        console.log(chalk.redBright(timeStamp + ` [initialDataService.js]: ` + error.message));
        return false;
    }
};

// Checking if the initial user's email is in use.
const checkInitialUser = async (userEmail) => {
    try {
        let emailUsed = await User.findOne({ email: userEmail });

        // If emailUsed is not falsy value then a user was found.
        return emailUsed ? true : false;
    } catch {
        // If error occurs get the current timestamp and print the error.
        const timeStamp = getCurrentTimeStampFormatted();
        console.log(chalk.redBright(timeStamp + ` [initialDataService.js]: ` + error.message));
        return false;
    }
};

module.exports = { generateInitialCards, generateInitialUsers };
