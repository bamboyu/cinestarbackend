const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// @route   GET /api/movies
// @desc    Get all movies (Populate category name)
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().populate(
      "moviecategoryID",
      "categoryName"
    );
    res.json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/movies
// @desc    Add a movie (Send JSON, not FormData)
router.post("/", async (req, res) => {
  const {
    title,
    description,
    duration,
    releaseDate,
    posterUrl,
    moviecategoryID,
  } = req.body;

  try {
    const newMovie = new Movie({
      title,
      description,
      duration,
      releaseDate,
      posterUrl, // Accepts a string URL
      moviecategoryID,
    });

    const movie = await newMovie.save();
    res.json(movie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/movies/:id
// @desc    Update a movie
router.put("/:id", async (req, res) => {
  const {
    title,
    description,
    duration,
    releaseDate,
    posterUrl,
    moviecategoryID,
  } = req.body;

  const movieFields = {};
  if (title) movieFields.title = title;
  if (description) movieFields.description = description;
  if (duration) movieFields.duration = duration;
  if (releaseDate) movieFields.releaseDate = releaseDate;
  if (posterUrl) movieFields.posterUrl = posterUrl;
  if (moviecategoryID) movieFields.moviecategoryID = moviecategoryID;

  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: movieFields },
      { new: true }
    );
    res.json(movie);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete a movie
router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ msg: "Movie removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
