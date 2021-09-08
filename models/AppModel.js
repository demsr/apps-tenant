const mongoose = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Redis = require("ioredis");
const publisher = new Redis();

const Schema = new mongoose.Schema({
  name: String,
  isDefault: { type: Boolean, default: false },
  url: String,
  redirects: [String],
});

Schema.post("save", (model) => {
  publisher.publish("app", JSON.stringify(model));
});

const Model = mongoose.model("App", Schema);

module.exports = Model;
