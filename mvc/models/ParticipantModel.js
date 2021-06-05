const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const IParticipant = new mongoose.Schema({
  userId: { type: ObjectId, require: true },
  team: { type: String },
  connection: { type: String },
  status: { type: String },
  checked: { type: Boolean },
  socketId: { type: String },
});

module.exports = mongoose.model("participant", IParticipant);
