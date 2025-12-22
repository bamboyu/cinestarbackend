const express = require("express");
const router = express.Router();
const Theater = require("../models/Theater");

// @route   GET /api/theaters
// @desc    Get all theaters
router.get("/", async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/theaters
// @desc    Add a theater (Admin only)
router.post("/", async (req, res) => {
  const { theaterName, phoneNumber, capacity, address } = req.body;

  try {
    const newTheater = new Theater({
      theaterName,
      phoneNumber,
      capacity,
      address,
    });

    const theater = await newTheater.save();
    res.json(theater);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
