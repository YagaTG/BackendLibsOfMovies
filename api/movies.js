const connection = require("../db");

const ratingMovie = (req, res) => {
    if (!req.user) {
        res.status(401);
        res.send("Unauthorized");
      } else { 
        const {userId, movieId, rating} = req.body;
        // connection.query("INSER")
      }
      
};

const searchMovie = (req, res) => {
  const { movieName } = req.query;
  connection.query(
    `SELECT * FROM movies WHERE name LIKE '%${movieName}%'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Movies matched: ", rows);
      res.json(rows);
    }
  );
}

module.exports = { ratingMovie, searchMovie };
