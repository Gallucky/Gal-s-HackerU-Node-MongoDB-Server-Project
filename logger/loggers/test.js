const winston = require("winston");
const RouteLogger = require("./customLogger");

// Usage examples
RouteLogger.get("GET /users", new Error());
RouteLogger.post("POST /users");
RouteLogger.put("PUT /users/123");
RouteLogger.patch("PATCH /users/123");
RouteLogger.delete("DELETE /users/123");
RouteLogger.info("General info log");
