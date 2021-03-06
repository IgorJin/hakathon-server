const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const Event = mongoose.Schema({
  start: { type: Date, default: Date.now },
  office: { type: String, require: true },
  sportId: { type: String, require: true },
  isEnded: { type: Boolean },
  lat: { type: String, default: 0 },
  lon: { type: String, default: 0 },
  participants: { type: [{ type: ObjectId }] },
  protocol: { type: [{ participantId: ObjectId, appearance: String }] },
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
