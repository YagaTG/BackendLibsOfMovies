var mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  port: 3306,
  database: "libs_of_movies",
});

// connection.connect();

module.exports = connection;