const { UserSchema } = require("../models/UserModel");

exports.userController = {
  profile: (req, res) => {
    try {
      const { userID } = req.query;
      const user = UserSchema.findById(userID);
      res.json(user);
    } catch (error) {
      res.status(500);
    }
  },
};
