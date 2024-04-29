const connection = require("../db");

const getMovieComments = (req, res) => {
  const { movieId } = req.query;
  connection.query(
    `SELECT * FROM comments where movieId='${movieId}'`,
    function (err, rows, fields) {
      if (err) throw err;
      // console.log("The solution is: ", rows);
      res.json(rows);
    }
  );
};

module.exports = {getMovieComments};
