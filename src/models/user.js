const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  username: {
    type: String,
    required: [true, "Username field cannot be empty."],
    minlength: [4, "Username must be between 4 and 32 characters."],
    maxlength: [32, "Username must be between 4 and 32 characters."],
    unique: true, // this is not a validator, it just creates an index...
    validate: {
      validator: fCheckIfUsernameIsAvaliable,
      message: (props) => `Username "${props.value}" is not avaliable.`
    }
  },
  password: {
    type: String,
    required: [true, "Password field cannot be empty."],
  },
  email: {
    type: String,
    required: [true, "Email field cannot be empty."],
    unique: true, // this is not a validator, it just creates an index...
    validate: {
      validator: fCheckIfEmailIsAvaliableAsync,
      message: (props) => `Email "${props.value}" is not avaliable.`
    }
  },
  createdArticles: {
    type: mongoose.Types.ObjectId,
    ref: "Article"
  }
});

async function fCheckIfUsernameIsAvaliable(value) {
  var result = null;
  try {
    result = await this.model("User").findOne({username: value}).lean();
  } catch (error) {
    throw new Error({message: "Unknown error."});
  }

  if (result == null) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
}

async function fCheckIfEmailIsAvaliableAsync(value) {
  var result = null;
  try {
    result = await this.model("User").findOne({email: value}).lean();
  } catch (error) {
    throw new Error({message: "Unknown error."});
  }

  if (result == null) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
}


module.exports = mongoose.model("User", userSchema);