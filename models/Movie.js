const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  posterUrl: {
    type: String, // Just a text field! You paste a URL here.
    default: "",
  },
  moviecategoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MovieCategory", // Requires you to have created the Category model
    required: true,
  },
});

module.exports = mongoose.model("Movie", MovieSchema);
