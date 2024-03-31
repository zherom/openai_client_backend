const cors = require("cors");
const express = require("express");
const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

const initRoutes = require("./routes.js");

//app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
initRoutes(app);

let port = process.env.PORT | 8080;
let host = process.env.HOST || 'localhost';
app.listen(port, () => {
  console.log(`Running at ${host}:${port}`);
});