const { UserSchema } = require("../models/UserModel");

exports.pointsController = {
  accrual: async (req, res) => {
    try {
      const { eventID, userID, factor } = req.body;
      const newPointsCout = factor;
      const user = await UserSchema.findByIdAndUpdate(userID, {
        points: newPointsCout,
      });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
};
