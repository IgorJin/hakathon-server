const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const Event = mongoose.Schema({
  startedAt: { type: Date, default: Date.now },
  hostId: { type: ObjectId },
  departmentId: { type: ObjectId, require: true },
  sportId: { type: String, require: true },
  isEnded: { type: Boolean },
  participants: { type: [{ type: ObjectId }] },
  protocol: { type: [{ participantId: ObjectId, appearance: String }] },
});

Event.methods.toDTO = function () {
  return {
    id: this.id,
    createdAt: this.createdAt,
    creator: this.creator,
    departmentId: this.departmentId,
    sportId: this.sportId,
    participants: this.participants,
  };
};

module.exports = mongoose.model("Event", Event);
