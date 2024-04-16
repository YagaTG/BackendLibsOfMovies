const express = require("express");
const connection = require("./db");
const cors = require("cors")

const app= express();   

app.use(express.json())
const PORT = 3500

// app.use(cors({ origin: "http://localhost:5173" })); // Прописываем CORS, что можно с этого ORIGIN отправлять данные

app.get("/", (req,res) => {
    res.json({messsage: "Сервер запущен"})
})

app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
  });