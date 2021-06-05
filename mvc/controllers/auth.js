const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { UserSchema } = require("../models/UserModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dcatserver@gmail.com",
    pass: "dcatserver1",
  },
});

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
  logIn: async (req, res) => {
    try {
      const { email, tabel } = req.body;

      const user = await UserSchema.findOne({ tabel });
      if (!user) res.status(400).json({ message: "Пользователь не найден" });

      const password = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

      const mailOption = {
        from: "dcatserver@gmail.com",
        to: email,
        subject: "Письмо отправленно через nodejs",
        text: `Ваш пароль для входа: ${password}`,
      };
      transporter.sendMail(mailOption);

      const { accessToken, refreshToken } = createTokens(user._id);

      res.status(200).json({ accessToken, refreshToken, password });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
};
