const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  username: {
    type: String,
    required: [true, "Username field cannot be empty."],
    unique: [true, "Username is not avaliable."],
    minlength: [4, "Username must be between 4 and 32 characters."],
    maxlength: [32, "Username must be between 4 and 32 characters."]
  },
  password: {
    type: String,
    required: [true, "Password field cannot be empty."],
  },
  email: {
    type: String,
    required: [true, "Email field cannot be empty."],
    unique: [true, "Email is not avaliable."],
  },
  createdArticles: {
    type: mongoose.Types.ObjectId,
    ref: "Article"
  }
});

module.exports = mongoose.model("user", userSchema);