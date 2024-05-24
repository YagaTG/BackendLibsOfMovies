const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");
const { Movie } = require("./MovieModel");

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

RatingModel.belongsTo(Movie, { foreignKey: "movieId" });

module.exports = { RatingModel };
