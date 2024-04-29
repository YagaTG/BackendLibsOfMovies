const express = require("express");
const connection = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-local");

const { getMovieComments } = require("./api/comments");
const { getOutcommingFriendsRequests, getIncommingFriendsRequests } = require("./api/user");
const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysql",
  database: "libs_of_movies",
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "sid",
      data: "session",
      expires: "expires",
    },
  },
};

const sessionStore = new MySQLStore(options);
const app = express();

passport.serializeUser((user, done) => {
  console.log("Inside serialize");
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Inside deserialize");
  try {
    await connection.query(
      `SELECT * FROM users WHERE id = '${id}'`,
      function (err, rows, fields) {
        if (err) throw err;
        console.log("The solution is: ", rows);
        // console.log(fields);
        if (rows[0]) done(null, rows[0]);
        else {
          throw new Error("Invalid Credetials");
        }
      }
    );
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new Strategy({ usernameField: "login" }, async (username, password, done) => {
    console.log(`Username: ${username}`);
    try {
      await connection.query(
        `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`,
        function (err, rows, fields) {
          if (err) throw err;
          console.log("The solution is: ", rows);
          if (rows[0]) done(null, rows[0]);
          else {
            throw new Error("Invalid Credetials");
          }
        }
      );
    } catch (err) {
      console.log(err);
      done(err, null);
    }
  })
);

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "qwas13242002QWzxsa",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
      secure: false,
    },
    store: sessionStore,
  })
);

sessionStore
  .onReady()
  .then(() => {
    // MySQL session store ready for use.
    console.log("MySQLStore ready");
  })
  .catch((error) => {
    // Something went wrong.
    console.error(error);
  });

app.use(passport.initialize());
app.use(passport.session());

const PORT = 3500;

app.use(cors({ origin: "http://192.168.0.103:5173", credentials: true })); // Прописываем CORS, что можно с этого ORIGIN отправлять данные

app.all("/api/loginUser", function (req, res, next) {
  res.set({
    "Access-Control-Allow-Origin": "http://192.168.0.103:5173",
    "Access-Control-Allow-Credentials": "true",
  });
  next();
});

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  res.json({ messsage: "Сервер запущен" });
});

app.get("/status", (req, res) => {
  // console.log(req.user);
  res.set({
    "Access-Control-Allow-Credentials": "true",
  });
  console.log("------");
  console.log(req.user);
  // if(!req.user) res.json({status: "BAD"});
  res.json({ staus: "OK" });
});

app.post("/api/loginUser", passport.authenticate("local"), (req, res) => {
  res.set({
    "Access-Control-Allow-Credentials": "true",
  });
  console.log(req.cookies);
  console.log(req.body);
  console.log(req.user);
  if (req.user) {
    const { id, username, mail } = req.user;
    res.json({ id, username, mail });
  } else {
    res.json({ messsage: "BAD" });
  }
});

app.get("/api/getAllMovies", (req, res) => {
  connection.query(`SELECT * FROM movies`, function (err, rows, fields) {
    if (err) throw err;
    console.log("The solution is: ", rows);
    res.json(rows);
  });
});

app.get("/api/getMovieData", (req, res) => {
  console.log(req.query);
  const { movieId } = req.query;
  connection.query(
    `SELECT * FROM movies where id='${movieId}'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("The solution is: ", rows[0]);
      // console.log(fields);
      res.json(rows[0]);
    }
  );
});

app.get("/api/getMovieComments", getMovieComments);

app.post("/api/createComment", (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Unauthorized");
  } else {
    const {authorId, authorUsername, movieId, text} = req.body
    console.log(req.body)
    connection.query(
      `INSERT INTO comments (authorId, authorUsername, movieId, text) VALUES ('${authorId}', '${authorUsername}', '${movieId}', '${text}')`,
      function (err, rows, fields) {
        if (err) throw err;
        res.json({ messsage: "sucess" });
      }
    );
    
  }
});

app.get("/api/getMovieReviews", (req, res) => {
  const { movieId } = req.query;
  connection.query(
    `SELECT * FROM reviews where movieId='${movieId}'`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("The solution is: ", rows);
      res.json(rows);
    }
  );
});

app.get("/api/getFriendsRequests", getOutcommingFriendsRequests);

app.get("/api/getIncommingFriendsRequests", getIncommingFriendsRequests);

app.listen(PORT, () => {
  console.log(`Example app listening on http://localhost:${PORT}`);
});
