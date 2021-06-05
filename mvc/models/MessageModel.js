const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const Message = mongoose.Schema({
  participant: { type: ObjectId },
  eventId: { type: ObjectId },
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
});

Message.methods.toDTO = function () {
  return {
    participant: this.participant,
    text: this.text,
    createdAt: this.createdAt,
    isSingleEmoji: this.isSingleEmoji,
  };
};

module.exports = mongoose.model("Message", Message);
