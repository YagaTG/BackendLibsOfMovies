const { connection } = require("../db");
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
  // SELECT incoming_user, username FROM friend_requests JOIN users ON incoming_user = users.id WHERE outcomming_user = 2
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
  // SELECT incoming_user, username FROM friend_requests JOIN users ON incoming_user = users.id WHERE outcomming_user = 2
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
  connection.query(
    `SELECT img FROM users WHERE username = '${username}'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("User Avatar: ", rows);
      if (!fs.existsSync(__dirname.replace("api", "") + rows[0].img)) {
        res.sendStatus(404);
      } else {
        res.sendFile(__dirname.replace("api", "") + rows[0].img);
      }
    }
  );
};

module.exports = {
  getOutcommingFriendsRequests,
  getIncommingFriendsRequests,
  registerUser,
  searchUser,
  dismissRequest,
  inviteFriend,
  addFriend,
  addUserAvatar,
  getUserAvatar,
};
