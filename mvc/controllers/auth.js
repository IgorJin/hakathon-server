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
  /** 
   * Авторизация пользователя по табельному номеру и ранее высланному паролю
   */
  logIn: async (req, res) => {
    try {
      const { tabel, password } = req.body;
      console.log(password)
      const hashedPassword = await bcrypt.hash(password, 5);
      console.log(hashedPassword)
      const user = await UserSchema.findOne({ tabel });
      console.log(user.password)

      if (!user || user.password != hashedPassword) {
        res.status(401).json({ message: "Пользователь не найден или неверно указан пароль" });
        return;
      }

      const { accessToken, refreshToken } = createTokens(user._id);
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },

  /** 
   * Активация пользователя по табельному номеру.
   * Привязываем почту к табельному и отправляем пароль
   */
  activate: async (req, res) => {
    try {
      const { email, tabel } = req.body;

      const user = await UserSchema.findOne({ tabel });

      if (!user) {
        res.status(404).json({
          code: 10001,
          message: "Пользователь с таким табельным номером не найден"
        });
        return
      }

      if (user.email != null) res.status(400).json({
        code: 10002,
        message: "Пользователь с таким табельным номером уже активирован"
      });

      const password = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000) + "";
      const { accessToken, refreshToken } = createTokens(user._id);
      const hashedPassword = await bcrypt.hash(password, 5);
      user.email = email
      user.password = hashedPassword
      await user.save()

      const mailOption = {
        from: "dcatserver@gmail.com",
        to: email,
        subject: "Ваш аккаунт на ПСБ.Спорт успешно активирован",
        text: `Ваш пароль для входа: ${password}`,
      };
      transporter.sendMail(mailOption);

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },

  /** 
   * Восстановление пароля
   */
  restore: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await UserSchema.findOne({ email: email });

      if (!user) {
        res.status(404).json({
          code: 10001,
          message: "Пользователь с такой почтой не найден"
        });
        return;
      }

      const password = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000) + "";
      console.log(password)
      const hashedPassword = await bcrypt.hash(password, 5);
      user.password = hashedPassword
      user.save()
      
      const mailOption = {
        from: "dcatserver@gmail.com",
        to: email,
        subject: "Восстановление доступа к ПСБ.Спорт",
        text: `Ваш пароль для входа: ${password}`,
      };
      transporter.sendMail(mailOption);

      res.status(200).json({ message: "Письмо с паролем отправлено на почту" });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "server error" });
    }
  },
};
