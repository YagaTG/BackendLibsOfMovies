const { Op } = require("sequelize");
const { Movie } = require("../models/MovieModel");
const { RatingModel, MovieModel } = require("../models");
const { sequelize } = require("../db");

const fs = require("fs");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `./afisha/`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

const getAllMovies = (req, res) => {
  // const offset = page * 1;
  // const limit = 1;
  Movie.findAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(404).json(err));
};

const getMovieData = (req, res) => {
  const { movieId } = req.query;
  Movie.findOne({ where: { id: movieId } }).then((data) => {
    res.json(data);
  });
};

const getMovieAfisha = (req, res) => {
  const { path } = req.query;
  res.sendFile(__dirname.replace("api", "") + path);
};

const createMovie = (req, res) => {
  if (req.user && req.user.isAdmin) {
    const { name, description, year } = req.body;
    Movie.create({ name: name, description: description, year: year })
      .then((data) => res.json({ message: "success", id: data.id }))
      .catch((err) => res.status(404).json(err));
  } else res.status(401).json({ message: "bad" });
};

const addMovieImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    }
    const { filename } = req.file;
    const { movieId } = req.query;
    const dir = `./afisha/`;
    Movie.update({ img: dir + filename }, { where: { id: movieId } })
      .then((data) => res.json({ message: "success" }))
      .catch((err) => res.status(404).json(err));
  });
};

const searchMovie = (req, res) => {
  const { movieName, yearFrom, yearTo, ratingFrom, ratingTo } = req.query;

  let filterQuery = ``;
  if (yearFrom) filterQuery += ` AND year >= ${yearFrom}`;
  if (yearTo) filterQuery += ` AND year <= ${yearTo}`;
  if (ratingFrom) filterQuery += ` AND rating >= ${ratingFrom}`;
  if (ratingTo) filterQuery += ` AND rating <= ${ratingTo}`;
  sequelize
    .query(
      `SELECT * FROM movies WHERE name LIKE '%${movieName}%' ${filterQuery}`,
      { type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

const ratingMovie = (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Unauthorized");
  } else {
    const { userId, movieId, rating } = req.body;
    RatingModel.create({
      userId: userId,
      movieId: movieId,
      rating: rating,
    }).then((data) => {
      RatingModel.findAll({
        where: { movieId: movieId },
        attributes: ["rating"],
      }).then((movies) => {
        let sumMovieRatings = movies.reduce(
          (sum, current) => sum + current.dataValues.rating,
          0
        );
        let movieRating = sumMovieRatings / movies.length;
        Movie.update(
          { rating: movieRating.toFixed(1) },
          { where: { id: movieId } }
        )
          .then((status) => res.json(status))
          .catch((err) => res.status(404).json(err));
      });
    });
  }
};

const getMovieRating = (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Unauthorized");
  } else {
    const { userId, movieId } = req.query;
    RatingModel.findOne({ where: { userId: userId, movieId: movieId } })
      .then((data) => res.json(data))
      .catch((err) => res.status(404).json(err));
  }
};

module.exports = {
  getAllMovies,
  getMovieData,
  getMovieAfisha,
  createMovie,
  addMovieImage,
  ratingMovie,
  searchMovie,
  ratingMovie,
  getMovieRating,
};
