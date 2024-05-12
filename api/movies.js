const { connection } = require("../db");
const { Op } = require("sequelize");
const { Movie } = require("../models/MovieModel");

const getAllMovies = (req, res) => {
  Movie.findAll().then((data) => {
    res.json(data);
  });
};

const getMovieData = (req, res) => {
  console.log(req.query);
  const { movieId } = req.query;
  Movie.findOne({ where: { id: movieId } }).then((data) => {
    console.log(data), res.json(data);
  });
};

const ratingMovie = (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Unauthorized");
  } else {
    const { userId, movieId, rating } = req.body;
    // connection.query("INSER")
  }
};

const searchMovie = (req, res) => {
  const { movieName } = req.query;
  Movie.findAll({ where: { name: { [Op.like]: `%${movieName}%` } } }).then(
    (data) => res.json(data)
  );
};

module.exports = { getAllMovies, getMovieData, ratingMovie, searchMovie };
