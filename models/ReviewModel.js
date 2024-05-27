const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");
const { User } = require("./UserModel");

const ReviewModel = sequelize.define(
  "review",
  {
    userId: DataTypes.INTEGER,
    movieId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    dignities: { type: DataTypes.JSON, defaultValue: [] },
    disadvantages: { type: DataTypes.JSON, defaultValue: [] },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "reviews",
    timestamps: false,
  }
);

ReviewModel.belongsTo(User, { foreignKey: "userId" });

module.exports = { ReviewModel };
