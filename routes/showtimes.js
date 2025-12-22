const express = require("express");
const router = express.Router();
const Showtime = require("../models/Showtime");

// @route   GET /api/showtimes
// @desc    Get all showtimes (optionally filter by movieID)
router.get("/", async (req, res) => {
  try {
    const { movieID } = req.query;
    let query = {};
    if (movieID) query.movieID = movieID;

    // .populate() pulls the actual Movie details instead of just the ID
    const showtimes = await Showtime.find(query)
      .populate("movieID")
      .populate("roomID");
    res.json(showtimes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/showtimes
// @desc    Add a showtime
router.post("/", async (req, res) => {
  const { movieID, roomID, startTime, status } = req.body;

  try {
    const newShowtime = new Showtime({
      movieID,
      roomID,
      startTime,
      status,
    });

    const showtime = await newShowtime.save();
    res.json(showtime);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
