const { connection } = require("../db");
const { Op } = require("sequelize");
const { Movie } = require("../models/MovieModel");
const { RatingModel } = require("../models");

const getAllMovies = (req, res) => {
  Movie.findAll().then((data) => {
    res.json(data);
  });
};

const getMovieData = (req, res) => {
  const { movieId } = req.query;
  Movie.findOne({ where: { id: movieId } }).then((data) => {
    res.json(data);
  });
};

const searchMovie = (req, res) => {
  const { movieName } = req.query;
  Movie.findAll({ where: { name: { [Op.like]: `%${movieName}%` } } }).then(
    (data) => res.json(data)
  );
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
    }).then((data) => res.json({ status: "succes" }));
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
  ratingMovie,
  searchMovie,
  ratingMovie,
  getMovieRating,
};
