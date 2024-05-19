const { connection } = require("../db");
const { Playlist } = require("../models/PlaylistModel");
const createPlaylist = (req, res) => {
  const { name, description, playlist, userId } = req.body;
  console.log(playlist);
  console.log(userId);
  Playlist.create({
    uid: userId,
    name: name,
    description: description,
    playlist: playlist,
  })
    .then((data) => res.json({ message: "succes" }))
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
};

const getUserPlaylists = (req, res) => {
  const { userId } = req.query;
  Playlist.findAll({ where: { uid: userId } })
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
};

const deletePlaylist = (req, res) => {
  // Playlist.de
};

const editPlaylist = (req, res) => {};

module.exports = { getUserPlaylists, createPlaylist, deletePlaylist };
