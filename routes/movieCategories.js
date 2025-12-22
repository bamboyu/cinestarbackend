const express = require("express");
const router = express.Router();
const MovieCategory = require("../models/MovieCategory");

// @route   GET /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await MovieCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/categories
router.post("/", async (req, res) => {
  try {
    const newCategory = new MovieCategory(req.body);
    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/categories/:id (NEW)
router.put("/:id", async (req, res) => {
  try {
    const category = await MovieCategory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/categories/:id (NEW)
router.delete("/:id", async (req, res) => {
  try {
    await MovieCategory.findByIdAndDelete(req.params.id);
    res.json({ msg: "Category deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
