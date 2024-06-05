const { Playlist } = require("../models/PlaylistModel");

const fs = require("fs");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { playlistId } = req.query;
    console.log(file);
    const dir = `./playlists/${playlistId.slice(0, 2)}`;
    if (!fs.existsSync(dir)) {
      console.log(file);
      fs.mkdirSync(dir);
    }
    console.log(file);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

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
  const { playlistId } = req.query;
  Playlist.destroy({ where: { id: playlistId } })
    .then((data) => res.json(data))
    .catch((err) => res.status(404).json(err));
};

const editPlaylist = (req, res) => {
  const { name, description, playlist, playlistId } = req.body;
  console.log(req.body);
  Playlist.update(
    { name: name, description: description, movies: JSON.parse(playlist) },
    { where: { id: playlistId } }
  )
    .then((data) => res.json({ message: "success", id: playlistId }))
    .catch((err) => res.status(404).json(err));
};

const addImageToPlaylist = (req, res) => {
  console.log("Зашло");
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    console.log("-------");

    const { filename } = req.file;
    const { playlistId } = req.query;
    const dir = `./playlists/${playlistId.slice(0, 2)}/`;
    Playlist.update({ img: dir + filename }, { where: { id: playlistId } })
      .then(() => res.json({ message: "success" }))
      .catch((err) => res.status(404).json(err));
  });
};

const getPlaylistImage = (req, res) => {
  const { path } = req.query;
  res.sendFile(__dirname.replace("api", "") + path);
};

module.exports = {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
  editPlaylist,
  addImageToPlaylist,
  getPlaylistImage,
};
