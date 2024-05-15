const { connection } = require("../db");
const { Comment } = require("../models/CommentModel");
const { User } = require("../models/UserModel");

const getMovieComments = (req, res) => {
  const { movieId } = req.query;
  Comment.findAll({
    attributes: ["id", "movieId", "text", "createdAt"],
    where: { movieId: movieId },
    include: [{ model: User, attributes: ["username", "img"] }],
  })
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

const createComment = (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Unauthorized");
  } else {
    const { authorId, movieId, text } = req.body;
    Comment.create({ authorId: authorId, movieId: movieId, text: text })
      .then((data) => {
        console.log(data);
        res.json({ message: "succes" });
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  }
};

module.exports = { getMovieComments, createComment };
