const { connection } = require("../db");

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

const createComment = (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Unauthorized");
  } else {
    const { authorId, authorUsername, movieId, text } = req.body;
    connection.query(
      `INSERT INTO comments (authorId, authorUsername, movieId, text) VALUES ('${authorId}', '${authorUsername}', '${movieId}', '${text}')`,
      function (err, rows, fields) {
        if (err) throw err;
        res.json({ messsage: "sucess" });
      }
    );
  }
};

module.exports = { getMovieComments, createComment };
