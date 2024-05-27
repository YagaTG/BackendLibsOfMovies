const { createServer } = require("node:http");
const express = require("express");
const app = express();
const server = createServer(app);

module.exports = { app, server };
