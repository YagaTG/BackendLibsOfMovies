var mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  port: 3306,
  database: "libs_of_movies",
});

// connection.connect();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("libs_of_movies", "root", "mysql", {
  host: "localhost",
  dialect:
    "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
});

module.exports = { connection, sequelize };
