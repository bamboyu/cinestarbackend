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
// @desc    Add a theater
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

// @route   PUT /api/theaters/:id
// @desc    Update a theater
router.put("/:id", async (req, res) => {
  const { theaterName, phoneNumber, capacity, address } = req.body;

  // Build theater object
  const theaterFields = {};
  if (theaterName) theaterFields.theaterName = theaterName;
  if (phoneNumber) theaterFields.phoneNumber = phoneNumber;
  if (capacity) theaterFields.capacity = capacity;
  if (address) theaterFields.address = address;

  try {
    let theater = await Theater.findById(req.params.id);

    if (!theater) return res.status(404).json({ msg: "Theater not found" });

    theater = await Theater.findByIdAndUpdate(
      req.params.id,
      { $set: theaterFields },
      { new: true } // Returns the updated document
    );

    res.json(theater);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/theaters/:id
// @desc    Delete a theater
router.delete("/:id", async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);

    if (!theater) return res.status(404).json({ msg: "Theater not found" });

    await Theater.findByIdAndDelete(req.params.id);

    res.json({ msg: "Theater removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
