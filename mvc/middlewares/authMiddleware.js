const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") next();

  try {
    const token = req.cookies.refreshToken;
    if (!token) res.status(403).json({ message: "token not defined" });

    const decoded = jwt.decode(token, config.get("jwt_secret"));
    if (!decoded) return res.status(403).json({ message: "uncorent token" });

    req.userID = decoded.userID;
  } catch (error) {
    res.status(403).json({ message: "auth error" });
  }
};
