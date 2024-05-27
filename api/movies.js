const { Op } = require("sequelize");
const { Movie } = require("../models/MovieModel");
const { RatingModel, MovieModel } = require("../models");
const { sequelize } = require("../db");

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
    .then((data) => res.json(data))
    .then((err) => res.status(404).json(err));
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
  ratingMovie,
  searchMovie,
  ratingMovie,
  getMovieRating,
};
