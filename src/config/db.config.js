const mongoose = require("mongoose");

const dbConnection = async function () {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(conn.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = dbConnection;
