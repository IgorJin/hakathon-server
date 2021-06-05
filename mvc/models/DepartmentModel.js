const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const IDepartment = mongoose.Schema({
  internalId: { type: String, require: true },
  region: { type: String, require: true },
});

module.exports = mongoose.model("Department", IDepartment);
