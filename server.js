require("dotenv").config();
const express = require("express");
const app = express();
const chalk = require("chalk");
const cors = require("cors");
const mdb = require("./db/MongoDB");
const fs = require("fs");
const jwt = require("express-jwt");
const guard = require("express-jwt-permissions")();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const App = require("./models/App");

const publicKey = fs.readFileSync("./public.key", "utf8");

app.use(jwt({ secret: publicKey, algorithms: ["RS256"] }));

app.use(guard.check("app:read"));

app.get("/", (req, res) => {
  App.find({}, (err, apps) => {
    if (err) return res.status(500).send("app.find err");
    res.send(apps);
  });
});

app.post("/", (req, res) => {
  let { name, url } = req.body;

  new App({
    name: name,
    url: url,
  }).save((err, app) => {
    if (err) return res.status(500).send("app.save err");
    res.send(app);
  });
});

app.get("/:appid", (req, res) => {
  let { appid } = req.params;

  App.findById(appid, (err, app) => {
    if (err) return res.status(500).send("app.findbyid err");
    if (!app) return res.status(404).send("app not found");
    res.send(app);
  });
});

mdb.once("open", () => {
  console.log(chalk.green("MongoDB connected"));
  app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
  });
});
