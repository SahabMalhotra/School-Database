// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: false,
    unique: false,
  },
  password: String,
  githubId: String,
});

module.exports = mongoose.model("User", userSchema);
