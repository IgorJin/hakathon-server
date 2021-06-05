const { UserSchema } = require("../models/UserModel");

exports.leaderboard = {
  get: async (req, res) => {
    const users = await UserSchema.find({}).sort({ ratio: -1 });
    res.json(users);
  },
};
