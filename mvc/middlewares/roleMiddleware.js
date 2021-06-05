const { UserSchema } = require("../models/UserModel");

exports.roleMiddleware = async (req, res, next) => {
  try {
    const userID = req.body;
    const userRole = await UserSchema.findById(userID, { role: 1 });
    // if(userRole === 'employee')
  } catch (error) {
    res.status(500).json({ message: "Недостаточно прав!" });
  }
};
