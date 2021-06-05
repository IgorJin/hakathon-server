const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const authRouter = require("./mvc/routes/auth");
const leaderboardRouter = require("./mvc/routes/leaderboard");
const pointsRouter = require("./mvc/routes/points");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/points", pointsRouter);

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://d-cat:120956@cluster0.frvio.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

app.listen(PORT, () => console.log("Server has been started on port ", PORT));

start();
