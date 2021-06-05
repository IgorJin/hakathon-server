const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const authRouter = require("./mvc/routes/authRouter");
const eventRouter = require("./mvc/routes/eventRouter");
const departmentRouter = require("./mvc/routes/departmentRouter");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res) => res.status(200).send("SERVER IS ALIVE"));

/*
//
  ROTES
//
*/

//AUTH
app.use("/api/auth", authRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/points", pointsRouter);

//DEPARTMENT
app.use("/api/department", departmentRouter);

//EVENT
app.use("/api/event", eventRouter);

/*
//
  START SERVER
//
*/
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
