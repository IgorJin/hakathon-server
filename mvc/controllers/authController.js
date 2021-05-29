const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { UserSchema } = require("../models/UserModel");

const createAccessToken = (userID) => {
  return jwt.sign({ userID }, config.get("jwt_secret"), {
    expiresIn: config.get("access_expireIn"),
  });
};
const createRefreshToken = (userID) => {
  return jwt.sign({ userID }, config.get("jwt_secret"), {
    expiresIn: config.get("refresh_expireIn"),
  });
};

const createTokens = (userID) => {
  const accessToken = createAccessToken(userID);
  const refreshToken = createRefreshToken(userID);
  return { accessToken, refreshToken };
};

exports.authController = {
  signUp: async (req, res) => {
    try {
      const { email, username, password } = req.body;
      if (
        (await UserSchema.findOne({ email })) ||
        (await UserSchema.findOne({ username }))
      ) {
        res.status(400).json({ message: "Такой пользователь уже есть" });
      }

      const hashedPassword = await bcrypt.hash(password, 5);
      const newUser = new UserSchema({
        email,
        password: hashedPassword,
        username,
      });
      newUser.save();
      const { accessToken, refreshToken } = createTokens(newUser._id);
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserSchema.findOne({ email });
      if (!user) res.status(400).json({ message: "Пользователь не найден" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) res.status(400).json({ message: "пароли не совпадают" });

      const { accessToken, refreshToken } = createTokens(user._id);
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  refresh: async (req, res) => {
    const userID = req.userID;
    const { accessToken, refreshToken } = createTokens(userID);
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.cookie("accessToken", accessToken, { httpOnly: true });
  },
};
