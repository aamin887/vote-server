require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const dbConnection = require("./database/connection.db");
const authRoute = require("./routes/auth/auth.routes");
const root = require("./routes/entry/root.routes");
const credentials = require("./middleware/credentials.middleware");
const logger = require("./middleware/logger.middleware");

const errorRoute = require("./routes/error/error.routes");
const corsOptions = require("./config/cors.config");
const errorHandler = require("./middleware/errorHandler.middleware");

const v1Index = require("./routes/index.routes");

const PORT = process.env.PORT;

const app = express();

// middlewares
app.use(logger);
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

// authentication route
app.use("/auth", authRoute);
// admin authentication
app.use("/auth/admins", require("./routes/auth/admin.routes"));
// version one of the api
app.use("/api/v1", v1Index);
// root entry
app.use("/", root);
// 404 routes
app.use("*", errorRoute);
// error routes
app.use(errorHandler);

app.listen(PORT, function () {
  dbConnection();
  console.log(`Server is running on PORT: ${PORT}`);
});

module.exports = app;
