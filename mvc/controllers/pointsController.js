const { UserSchema } = require("../models/UserModel");
const Event = require("../");
exports.pointsController = {
  accrual: async (req, res) => {
    try {
      const { eventID, userID, factor } = req.body;
      const eventValue = await Event;
      const newPointsCout = factor;
      const user = await UserSchema.findByIdAndUpdate(userID, {
        points: newPointsCout,
      });
    } catch (error) {
      res.status(400).json({ message: "server error" });
    }
  },
};
