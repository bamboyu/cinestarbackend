const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// @route   GET /api/movies
// @desc    Get all movies (Support Search by Title or Description)
router.get("/", async (req, res) => {
  try {
    // --- BẮT ĐẦU PHẦN SỬA ---
    // 1. Lấy từ khóa search từ URL (ví dụ: ?search=Kungfu)
    const { search } = req.query;

    // 2. Tạo điều kiện tìm kiếm mặc định là rỗng (lấy hết)
    let queryCondition = {};

    // 3. Nếu có từ khóa search, tạo bộ lọc
    if (search) {
      queryCondition = {
        $or: [
          // Tìm trong Title (không phân biệt hoa thường - 'i')
          { title: { $regex: search, $options: "i" } },
          // Tìm luôn trong Description (nếu muốn)
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    // 4. Truyền điều kiện vào hàm find()
    const movies = await Movie.find(queryCondition).populate(
      "moviecategoryID",
      "categoryName"
    );
    // --- KẾT THÚC PHẦN SỬA ---

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
