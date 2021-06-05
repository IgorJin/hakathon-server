const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const Event = mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  office: { type: String, require: true },
  label: { type: String, require: true },
  start: { type: Date, require: true },
  end: { type: Date, require: true },
  isEnded: { type: Boolean, require: true, default: false },
  participants: { type: [{ userId: ObjectId, team: String, status: String }] },
  protocol: { type: [{ participantId: ObjectId, appearance: String }] },
  lat: String,
  lon: String,
});

// Event.methods.toDTO = function () {
//   return {
//     id: this.id,
//     createdAt: this.createdAt,
//     creator: this.creator,
//     departmentId: this.departmentId,
//     sportId: this.sportId,
//     participants: this.participants,
//   };
// };

module.exports = mongoose.model("Event", Event);
