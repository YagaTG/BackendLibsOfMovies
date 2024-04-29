const connection = require("../db");
const { hashPassword } = require("../utils/helpers");

const logout = (req, res) => {
  req.user = null;
  // connection.query(
  //     `DELETE * FROM movies where id='${movieId}'`,
  //     function (err, rows, fields) {
  //       if (err) throw err;
  //       console.log("The solution is: ", rows[0]);
  //       // console.log(fields);
  //       res.json(rows[0]);
  //     }
  //   );
};

const registerUser = (req, res) => {
  const {} = req.body;
  hashPassword();
};

const searchUser = (req, res) => {
  const { searchString } = req.body;
  connection.query(
    `SELECT username FROM users WHERE username LIKE '%${searchString}%'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Users matched: ", rows);
      res.json(rows);
    }
  );
};

const getOutcommingFriendsRequests = (req, res) => {
  const { userId } = req.query;
  console.log("Запрос на получение заявок", userId);
  connection.query(
    `SELECT incoming_user, username FROM friend_requests JOIN users ON incoming_user = users.id WHERE outcomming_user=${userId}`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Friend requests is: ", rows);
      res.json(rows);
    }
  );
  // SELECT incoming_user, username FROM friend_requests JOIN users ON incoming_user = users.id WHERE outcomming_user = 2
};

const getIncommingFriendsRequests = (req, res) => {
  const { userId } = req.query;
  console.log("Запрос на получение входящих заявок", userId);
  connection.query(
    `SELECT outcomming_user, username FROM friend_requests JOIN users ON outcomming_user = users.id WHERE incoming_user=${userId}`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Friend requests is: ", rows);
      res.json(rows);
    }
  );
  // SELECT incoming_user, username FROM friend_requests JOIN users ON incoming_user = users.id WHERE outcomming_user = 2
};

module.exports = { getOutcommingFriendsRequests, getIncommingFriendsRequests };
