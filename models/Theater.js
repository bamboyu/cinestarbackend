const mongoose = require("mongoose");

const TheaterSchema = new mongoose.Schema({
  theaterName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  // Rooms will be linked via ScreeningRoom model (referencing this Theater's ID)
});

module.exports = mongoose.model("Theater", TheaterSchema);
