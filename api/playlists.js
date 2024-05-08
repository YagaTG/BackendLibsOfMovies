const connection = require("../db");
const createPlaylist = (req, res) => {
  const { name, description, playlist, userId } = req.body;
  console.log(playlist);
  console.log(userId);
  connection.query(
    `INSERT INTO playlists_table (uid, name, description, img, movies) VALUES ('${userId}','${name}', '${description}', '', '${playlist}')`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Playlist created: ", rows);
      res.json(rows);
    }
  );
};

module.exports = { createPlaylist };
