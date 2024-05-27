const { CommentModel } = require("./CommentModel");
const { MovieModel } = require("./MovieModel");
const { User } = require("./UserModel");
const { RatingModel } = require("./RatingModel");
const { MessageModel } = require("./MessageModel");
const { ReviewModel } = require("./ReviewModel");
const { PostModel } = require("./PostModel");

module.exports = {
  CommentModel,
  MovieModel,
  RatingModel,
  User,
  MessageModel,
  ReviewModel,
  PostModel
};
