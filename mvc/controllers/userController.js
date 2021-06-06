const { UserSchema } = require("../models/UserModel");

exports.userController = {
  profile: (req, res) => {
    try {
      const { userID } = req.query;
      const user = UserSchema.findById(userID);
      res.json(user);
    } catch (error) {
      res.sendStatus(500);
    }
  },

  team: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserSchema.findById(id);
      if (!user) throw Error("user didnt find");

      const team = await UserSchema.find({ departamentID: user.departamentID });
      const topPoints = Math.max(...team.map(t => t.points))
      const result = {
        team: user.departamentID,
        points: team.reduce((acc, el) => (acc + el.points), 0),
        topPlayer: team.find(t => t.points === topPoints)
      };
      res.json(result);
    } catch (error) {
      res.sendStatus(500);
    }
  },
};
