const { connection } = require("../db");
const { RatingModel } = require("../models");
const { Movie } = require("../models/MovieModel");
const { User } = require("../models/UserModel");
const { hashPassword } = require("../utils/helpers");
const fs = require("fs");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { username } = req.query;
    const dir = `./avatars/${username.slice(0, 2)}`;
    if (!fs.existsSync(dir)) {
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

const logout = (req, res) => {
  req.user = null;
};

const getMe = (req, res) => {
  const { userId } = req.query;
  // console.log(req.user);
  if (req.user && req.user.id == userId) {
    User.findOne({ where: { id: userId } })
      .then((data) => res.json(data))
      .catch((err) => res.status(404).json(err));
  } else {
    res.status(401).json({ status: "Unlogin" });
  }
};

const registerUser = (req, res) => {
  const { mail, login, password } = req.body;
  const hashedPassword = hashPassword(password);
  connection.query(
    `INSERT INTO users (username, password, mail, friends, img) VALUES ('${login}', '${hashedPassword}', '${mail}', '[]', '')`,
    function (err, rows, fields) {
      if (err) throw err;
      res.json({ messsage: "sucess" });
    }
  );
};

const searchUser = (req, res) => {
  const { username } = req.query;
  console.log(username);
  connection.query(
    `SELECT username, id, friends FROM users WHERE username LIKE '%${username}%'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Users matched: ", rows);
      res.json(rows);
    }
  );
};

const dismissRequest = (req, res) => {
  console.log(req.body);
  const { incommingUser, outcommingUser } = req.body;
  connection.query(
    `DELETE FROM friend_requests WHERE incoming_user = '${incommingUser}' AND outcomming_user = '${outcommingUser}'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Dismiss request: ", rows);
      res.json(rows);
    }
  );
};

const getOutcommingFriendsRequests = (req, res) => {
  const { userId } = req.query;
  console.log("Запрос на получение заявок", userId);
  connection.query(
    `SELECT incoming_user, username, friends FROM friend_requests JOIN users ON incoming_user = users.id WHERE outcomming_user=${userId}`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Friend requests is: ", rows);
      res.json(rows);
    }
  );
};

const getIncommingFriendsRequests = (req, res) => {
  const { userId } = req.query;
  console.log("Запрос на получение входящих заявок", userId);
  connection.query(
    `SELECT outcomming_user, username, friends FROM friend_requests JOIN users ON outcomming_user = users.id WHERE incoming_user=${userId}`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Friend requests is: ", rows);
      res.json(rows);
    }
  );
};

const inviteFriend = (req, res) => {
  const { incommingUser, outcommingUser } = req.body;
  connection.query(
    `INSERT INTO friend_requests VALUES ('${outcommingUser}', '${incommingUser}')`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Friend requests is: ", rows);
      res.json(rows);
    }
  );
};

const addFriend = (req, res) => {
  console.log(addFriend);
  const { id, friends, outcommingUser, outcommingUserFriends } = req.body;
  connection.query(
    `UPDATE users SET friends = '${friends}' WHERE id = '${id}'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Friend added to user");
      // res.json(rows);
    }
  );
  connection.query(
    `UPDATE users SET friends = '${outcommingUserFriends}' WHERE id = '${outcommingUser}'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Friend added to out user");
      // res.json(rows);
    }
  );
  connection.query(
    `DELETE FROM friend_requests WHERE incoming_user = '${id}' AND outcomming_user = '${outcommingUser}'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("Friend request deleted");
      res.json(rows);
    }
  );
};

const deleteFriend = (req, res) => {
  const { userId, newUserFriendsList, friendId } = req.body;
  console.log(userId, newUserFriendsList, friendId);
  User.update(
    { friends: JSON.parse(newUserFriendsList) },
    { where: { id: userId } }
  )
    .then(() => {
      User.findOne({ where: { id: friendId } })
        .then((data) => {
          const oldFriendsList = [...data.dataValues.friends];

          const newFriendsList = oldFriendsList.filter(
            (friend) => friend.id != userId
          );
          User.update({ friends: newFriendsList }, { where: { id: friendId } })
            .then(() => res.json({ message: "success" }))
            .catch((err) => res.status(404).json(err));
        })
        .catch((err) => res.status(403).json(err));
    })
    .catch((err) => res.status(402).json(err));
};

const addUserAvatar = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    console.log("-------");

    const { filename } = req.file;
    const { username } = req.query;
    const dir = `./avatars/${username.slice(0, 2)}`;
    connection.query(
      `UPDATE users SET img = '${
        dir + "/" + filename
      }' WHERE username = '${username}'`,
      function (err, rows, fields) {
        if (err) throw err;
        console.log("Avatar added to out user");
        res.json({ message: "succes" });
      }
    );
  });
};

const getUserAvatar = (req, res) => {
  const { username } = req.query;
  User.findOne({ where: { username: username } })
    .then((data) => {
      if (!fs.existsSync(__dirname.replace("api", "") + data.img)) {
        res.sendStatus(404);
      } else {
        res.sendFile(__dirname.replace("api", "") + data.img);
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(404).json(e);
    });
};

const getMyMoviesRatings = (req, res) => {
  const { userId } = req.query;
  RatingModel.findAll({
    where: { userId: userId },
    include: [
      {
        model: Movie,
        attributes: ["name", "year", ["rating", "movieRating"]],
      },
    ],
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(404).json(err));
};

module.exports = {
  getMe,
  getOutcommingFriendsRequests,
  getIncommingFriendsRequests,
  registerUser,
  searchUser,
  dismissRequest,
  inviteFriend,
  addFriend,
  deleteFriend,
  addUserAvatar,
  getUserAvatar,
  getMyMoviesRatings,
};
