require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const dbConnection = require("./config/db.config");
const authRoute = require("./routes/auth.routes");
const root = require("./routes/root.routes");
const credentials = require("./middleware/credentials.middleware");
const logger = require("./utils/logger.utils");

const errorRoute = require("./routes/error.routes");
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
