const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const Event = mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  creator: { type: ObjectId },
  departmentId: { type: ObjectId, require: true },
  sportId: { type: String, require: true},
  participants: { type: [{ type: ObjectId }] },
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
