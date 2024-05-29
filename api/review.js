const { ReviewModel, User } = require("../models");

const createReview = (req, res) => {
  const { userId, movieId, reviewText, reviewMinus, reviewPlus } = req.body;
  ReviewModel.create({
    userId: userId,
    movieId: movieId,
    text: reviewText,
    disadvantages: reviewMinus,
    dignities: reviewPlus,
  })
    .then(() => res.json({ message: "success" }))
    .catch((err) => res.status(404).json(err));
};

const getMovieReviews = (req, res) => {
  const { movieId } = req.query;
  ReviewModel.findAll({
    where: {
      movieId: movieId,
    },
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(404).json(err));
};

const getAllReviews = (req, res) => {
  ReviewModel.findAll({
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(404).json(err));
};

const publishReview = (req, res) => {
  const { reviewId } = req.query;
  ReviewModel.update(
    {
      isPublished: 1,
    },
    { where: { id: reviewId } }
  )
    .then((data) => res.json({ message: "success" }))
    .catch((err) => res.status(404).json(err));
};

module.exports = {
  createReview,
  getMovieReviews,
  getAllReviews,
  publishReview,
};
