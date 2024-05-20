const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");

const RatingModel = sequelize.define(
  "rating",
  {
    userId: DataTypes.INTEGER,
    movieId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
  },
  { tableName: "movieratings", timestamps: false }
);

RatingModel.removeAttribute("id");

module.exports = { RatingModel };
