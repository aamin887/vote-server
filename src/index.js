require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const dbConnection = require("./database/connection.db");

const root = require("./routes/entry/root.routes");
const credentials = require("./middleware/credentials.middleware");
const logger = require("./middleware/logger.middleware");

const errorRoute = require("./routes/error/error.routes");
const corsOptions = require("./config/cors.config");
const errorHandler = require("./middleware/errorHandler.middleware");

const v1Index = require("./routes/v1/index.routes");
const PORT = process.env.PORT;
const app = express();

// middlewares
app.use(logger("test.txt"));
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// accessing statics files
app.use("/", express.static(path.join(__dirname, "public")));

// root entry
app.use("/", root);

// admin authentication
app.use("/auth/users", require("./routes/auth/users.routes"));
app.use("/auth/voters", require("./routes/auth/users.routes"));

// version one of the api
app.use("/api/v1", v1Index);

// 404 routes
app.use("*", errorRoute);
// error handler
app.use(errorHandler);

app.listen(PORT, function () {
  dbConnection();
  console.log(`Server is running on PORT: ${PORT}`);
});

module.exports = app;
