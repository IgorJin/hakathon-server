const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, require: true },
  email: { type: String, require: true },
  role: { type: String, require: true },
  points: { type: Number, require: true, default: 0 },
  events: { type: Types.ObjectId, ref: "events" },
  tabel: { type: String, require: true },
  departamentID: { type: String, require: true },
});

exports.UserSchema = model("user", userSchema);
