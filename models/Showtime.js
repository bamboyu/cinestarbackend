const mongoose = require("mongoose");

const ShowtimeSchema = new mongoose.Schema({
  movieID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie", // Links to the Movie collection
    required: true,
  },
  roomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScreeningRoom", // Links to the ScreeningRoom collection
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Full", "Cancelled"],
    default: "Available",
  },
});

module.exports = mongoose.model("Showtime", ShowtimeSchema);
