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

    const showtimes = await Showtime.find(query)
      .populate("movieID", "title") // Get Movie Title
      .populate("roomID", "name"); // Get Room Name

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

// @route   PUT /api/showtimes/:id
// @desc    Update a showtime
router.put("/:id", async (req, res) => {
  const { movieID, roomID, startTime, status } = req.body;

  const showtimeFields = {};
  if (movieID) showtimeFields.movieID = movieID;
  if (roomID) showtimeFields.roomID = roomID;
  if (startTime) showtimeFields.startTime = startTime;
  if (status) showtimeFields.status = status;

  try {
    let showtime = await Showtime.findById(req.params.id);

    if (!showtime) return res.status(404).json({ msg: "Showtime not found" });

    showtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      { $set: showtimeFields },
      { new: true }
    );

    res.json(showtime);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/showtimes/:id
// @desc    Delete a showtime
router.delete("/:id", async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) return res.status(404).json({ msg: "Showtime not found" });

    await Showtime.findByIdAndDelete(req.params.id);

    res.json({ msg: "Showtime removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
