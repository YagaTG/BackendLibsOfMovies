const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");
const { User } = require("./UserModel");
const { Movie } = require("./MovieModel");

const PostModel = sequelize.define(
  "post",
  {
    authorId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    movieId: DataTypes.TINYINT,
  },
  {
    tableName: "posts",
  }
);

PostModel.belongsTo(User, { foreignKey: "authorId" });
PostModel.belongsTo(Movie, { foreignKey: "movieId" });

module.exports = { PostModel };
