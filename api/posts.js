const { PostModel, User } = require("../models/");
const { Movie } = require("../models/MovieModel");

const getAllPosts = (req, res) => {
  PostModel.findAll({
    include: [
      { model: User, attributes: ["username"] },
      { model: Movie, attributes: ["name", "year"] },
    ],
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(404).json(err));
};

const createPost = (req, res) => {
  const { userId, title, text, movieId } = req.body;
  PostModel.create({
    authorId: userId,
    title: title,
    text: text,
    movieId: movieId,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(404).json(err));
};

module.exports = { getAllPosts, createPost };
