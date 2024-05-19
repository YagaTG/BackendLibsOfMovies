const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Playlist = sequelize.define(
  "playlist",
  {
    uid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    img: { type: DataTypes.STRING, defaultValue: "" },
    movies: { type: DataTypes.JSON, defaultValue: [] },
  },
  {
    tableName: "playlists_table",
    timestamps: false,
  }
);

module.exports = { Playlist };
