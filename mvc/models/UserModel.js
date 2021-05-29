const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
});

exports.UserSchema = model("user", userSchema);
