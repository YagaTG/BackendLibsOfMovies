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

module.exports = { ratingMovie };
