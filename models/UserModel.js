const { sequelize } = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "user",
  {
    username: DataTypes.STRING(80),
    password: DataTypes.STRING(250),
    mail: DataTypes.STRING(120),
    friends: { type: DataTypes.JSON, defaultValue: [] },
    img: { type: DataTypes.STRING(255), defaultValue: "" },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = { User };
