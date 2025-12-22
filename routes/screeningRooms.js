const express = require("express");
const router = express.Router();
const ScreeningRoom = require("../models/ScreeningRoom");

// @route   GET /api/rooms
// @desc    Get all rooms (Can filter by ?theaterID=...)
router.get("/", async (req, res) => {
  try {
    const { theaterID } = req.query;
    let query = {};

    // If theaterID is provided in URL, filter by it
    if (theaterID) query.theaterID = theaterID;

    const rooms = await ScreeningRoom.find(query).populate(
      "theaterID",
      "theaterName"
    );
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/rooms
// @desc    Add a new screening room
router.post("/", async (req, res) => {
  const { name, capacity, status, theaterID } = req.body;

  try {
    const newRoom = new ScreeningRoom({
      name,
      capacity,
      status,
      theaterID,
    });

    const room = await newRoom.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update room details (e.g. change status to Maintenance)
router.put("/:id", async (req, res) => {
  const { name, capacity, status, theaterID } = req.body;

  const roomFields = {};
  if (name) roomFields.name = name;
  if (capacity) roomFields.capacity = capacity;
  if (status) roomFields.status = status;
  if (theaterID) roomFields.theaterID = theaterID;

  try {
    let room = await ScreeningRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    room = await ScreeningRoom.findByIdAndUpdate(
      req.params.id,
      { $set: roomFields },
      { new: true }
    );

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete a room
router.delete("/:id", async (req, res) => {
  try {
    const room = await ScreeningRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    await ScreeningRoom.findByIdAndDelete(req.params.id);
    res.json({ msg: "Screening Room removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
