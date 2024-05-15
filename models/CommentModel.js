const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");
const { Movie } = require("./MovieModel");
const { User } = require("./UserModel");
const Comment = sequelize.define(
  "comment",
  {
    authorId: DataTypes.INTEGER,
    movieId: { type: DataTypes.FLOAT, defaultValue: 0 },
    text: DataTypes.TEXT,
  },
  {
    tableName: "comments",
    timestamps: false,
  }
);

Comment.belongsTo(User, { foreignKey: "authorId" });

module.exports = { Comment };
