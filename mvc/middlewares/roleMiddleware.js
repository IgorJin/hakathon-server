exports.roleMiddleware = (req, res, next) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Недостаточно прав!" });
  }
};
