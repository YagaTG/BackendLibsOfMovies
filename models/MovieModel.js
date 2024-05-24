const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Movie = sequelize.define(
  "movie",
  {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    year: DataTypes.INTEGER,
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    img: DataTypes.STRING,
  },
  {
    tableName: "movies",
    timestamps: false,
  }
);

module.exports = { Movie };
