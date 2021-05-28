const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    app.listen(PORT, () =>
      console.log("Server has been started on port ", PORT)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
module.exports = app;
