const { UserSchema } = require("../models/UserModel");

exports.leaderboard = {
  get: async (req, res) => {
    try {
      const users = await UserSchema.find({}).sort({ ratio: -1 });
      res.json(users);
    } catch (error) {
      res.status(400);
    }
  },
};
