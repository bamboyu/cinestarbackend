const mongoose = require("mongoose");

const MovieCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("MovieCategory", MovieCategorySchema);
