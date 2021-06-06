const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const authRouter = require("./mvc/routes/authRouter");
const eventRouter = require("./mvc/routes/eventRouter");
const departmentRouter = require("./mvc/routes/departmentRouter");
const userRouter = require("./mvc/routes/userRouter");
const eventSocketRouter = require("./mvc/routes/eventSocketRouter");

io.on("connection", (socket) => {
  console.log("Create socket connection");
  io.emit("chat message", { mesage: "somemessaage" });

  eventSocketRouter(io, socket);
});
const errorHandler = require("./mvc/middlewares/errorHandlingMiddleware");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(errorHandler);
/*
//
  ROUTES
//
*/

app.use(express.static(__dirname));

app.use(multer({ dest: "uploads" }).any());

app.post("/api/upload", function (req, res, next) {
  let filedata = req.files;
  if (!filedata) res.send("Ошибка при загрузке файла");
  else res.send("Файл загружен");
});

app.use("/alive", (req, res) => res.status(200).send("SERVER IS ALIVE"));

//AUTH
app.use("/api/auth", authRouter);

//DEPARTMENT
app.use("/api/department", departmentRouter);

//EVENT
app.use("/api/event", eventRouter);

//USER
app.use("/api/user", userRouter);

app.use(errorHandler);
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

server.listen(PORT, () =>
  console.log("Server has been started on port ", PORT)
);

start();
