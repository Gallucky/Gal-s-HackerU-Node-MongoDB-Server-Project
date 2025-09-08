# Gal's HackerU Node + MongoDB Server Project

## Overview

This is a Node.js backend project built with Express and MongoDB (Mongoose), designed to provide a robust RESTful API for user management, authentication, and card (business card) management. The project is modular, with clear separation of concerns for authentication, data access, validation, logging, and error handling.

---

## Table of Contents

-   [Gal's HackerU Node + MongoDB Server Project](#gals-hackeru-node--mongodb-server-project)
    -   [Overview](#overview)
    -   [Table of Contents](#table-of-contents)
    -   [Project Structure](#project-structure)
    -   [Getting Started](#getting-started)
    -   [Environment Configuration](#environment-configuration)
        -   [Authentication](#authentication)
    -   [API Routes](#api-routes)
        -   [Users](#users)
        -   [Cards](#cards)
    -   [Utilities \& Middleware](#utilities--middleware)
    -   [Logging](#logging)
    -   [Testing](#testing)
    -   [License](#license)
    -   [Contact](#contact)

---

## Project Structure

```.txt
server.js                # Entry point
auth/                    # Authentication logic (JWT, etc.)
cards/                   # Card-related models, routes, services, validations
DB/                      # Database connection logic
logger/                  # Logging utilities
middlewares/             # Custom middleware (e.g., CORS)
router/                  # Main router
users/                   # User-related models, routes, services, validations
utils/                   # Utility functions (error handling, formatting, etc.)
```

---

## Getting Started

1. **Install dependencies:**

    ```sh
    npm install
    ```

2. **Set up environment variables and configuration:**

    - Edit the files in `config/` as needed for your environment.

3. **Start the server:**

    **Remotely**

    ```sh
    npm run start
    ```

    **Locally**

    ```sh
     npm run dev
    ```

    The server will run on the port specified in your configuration.

---

## Environment Configuration

-   `config/default.json`, `config/development.json`, `config/production.json`  
    Configure MongoDB URIs, JWT secrets, and other environment-specific settings here.

---

### Authentication

`authService` - A middleware that authenticates the user for each required route as needed, returns JWT.

---

## API Routes

### Users

| Method | Endpoint       | Description                                     |
| ------ | -------------- | ----------------------------------------------- |
| POST   | `/users`       | Register a new user                             |
| POST   | `/users/login` | User account login                              |
| GET    | `/users`       | Get all users (admin only)                      |
| GET    | `/users/:id`   | Get user by ID (owner or admin only)            |
| UPDATE | `/users/:id`   | Update/Edit current user's profile (owner only) |
| PATCH  | `/users/:id`   | Change user's isBusiness (owner only)           |
| DELETE | `/users/:id`   | Delete user by ID (owner or admin only)         |

**Example Request:**

```json
POST /users/login
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

---

### Cards

| Method | Endpoint                            | Description                                  |
| ------ | ----------------------------------- | -------------------------------------------- |
| GET    | `/cards`                            | Get all cards                                |
| GET    | `/cards/my-cards`                   | Get cards created by current user            |
| GET    | `/cards/:id`                        | Get card by ID                               |
| POST   | `/cards`                            | Create a new card (business users only)      |
| PUT    | `/cards/:id`                        | Updates a card (owner only)                  |
| PATCH  | `/cards/:id`                        | Likes or unlikes a card (auth required)      |
| PATCH  | `/cards/change-business-number/:id` | Re-generates a card's bizNumber (admin only) |
| DELETE | `/cards/:id`                        | Delete card by ID (owner or admin only)      |

---

## Utilities & Middleware

-   **CORS:** Configured in `middlewares/cors.js`.
-   **Error Handling:** Centralized error handling in `utils/errorHandler.js` and `utils/handleErrors.js`.
-   **Validation:** Joi-based validation for users and cards.

---

## Logging

-   **Custom Logger:** A standalone logger see `logger/loggers/customLogger.js`.
-   **HTTP Logging:** Morgan logger in `logger/loggers/morganLogger.js`.
-   **Logger Service:** Loggers manager see `logger/loggerService.js`.
-   **Error Logs:** Written to `logger/loggers/errors.log`.

---

## Testing

-   Tests are can be added in the `tests/` directory.
-   Run tests with:
    ```sh
    npm test
    ```
    Note: This will run the script called `tests.js` in the `tests/` directory.
-   Tests are **not** uploaded to git (added to .gitignore) and currently the `tests/` directory was removed.

---

## License

This project is for educational purposes at HackerU.

---

## Contact

For questions or issues, please contact Gal.
