import { chalkError, chalkSuccess } from "./tools/chalk";
import connect from "./db";
import logger from "./tools/winston";

import app from "./app";

connect();

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${chalkSuccess(port)}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(
    chalkError("Unhandled Rejection at:", promise, "reason:", reason)
  );
  // Application specific logging, throwing an error, or other logic here
});

app.on("error", (err) => {
  console.log(chalkError("Express error:", err));
  // Application specific logging, throwing an error, or other logic here
});
process.on("uncaughtException", (err) => {
  console.log(chalkError("Uncaught Exception:", err));
  // Application specific logging, throwing an error, or other logic here
});

process.on("SIGINT", () => {
  logger.warn("SIGINT signal received.");
  process.exit();
});

process.on("SIGTERM", () => {
  logger.warn("SIGTERM signal received.");
  process.exit();
});
