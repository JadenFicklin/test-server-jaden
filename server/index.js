require("dotenv").config();
const { DATABASE_URL } = process.env;
const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const path = require("path");
const { user } = require("pg/lib/defaults");

const app = express();
// const port = process.env.PORT || 5000;

//added
app.use(express.static(path.resolve(__dirname, "../build")));

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "popstgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const users = await sequelize.query(`SELECT username FROM users`);

  // Sequel to check if username is already taken
  // `SELECT username FROM users WHERE username = '${username}'`;
  // [[], { meta }][([{ username: "abo" }], { meta })];

  // console.log(users);

  // for (let i = 0; i < users[0].length; i++) {
  //   console.log(users[0][i].username, username);
  //   if (users[0][i].username === username) {
  //     return res.status(400).send("username already exists");
  //   } else {

  return sequelize
    .query(
      `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`
    )
    .then((result) => res.send(result[0]).status(200));
  //   }
  // }
});

//added
app.get("./*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("/test", function (req, res) {
  res.send("hello!");
});

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// npm i sequelize pg pg-hstore axios dotenv express cors
