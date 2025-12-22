const mongoose = require("mongoose");

const ScreeningRoomSchema = new mongoose.Schema({
  name: {
    type: String, // e.g., "Room 1" or "IMAX Hall"
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Maintenance", "Closed", "Cleaning"],
    default: "Active",
  },
  theaterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater", // Links this room to the 'Theater' collection
    required: true,
  },
});

module.exports = mongoose.model("ScreeningRoom", ScreeningRoomSchema);
