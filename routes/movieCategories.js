const express = require("express");
const router = express.Router();
const MovieCategory = require("../models/MovieCategory");

router.get("/", async (req, res) => {
  try {
    const categories = await MovieCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const newCategory = new MovieCategory(req.body);
    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
