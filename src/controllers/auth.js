"use strict";

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

const getLoginPage = (req, res) => {
  const data = {
    pageTitle: "Login",
    bUserIsAuthenticated: req.session.bUserIsAuthenticated
  }
  res.render("auth/login.ejs", data);
}

const getRegisterPage = (req, res) => {
  const data = {
    pageTitle: "Register",
    bUserIsAuthenticated: req.session.bUserIsAuthenticated
  }
  res.render("auth/register.ejs", data);
}

const postLogin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Stage 1. Input Data Validation
  const bUsernameFieldIsEmpty = (username === "" ? true : false );
  const bPasswordFieldIsEmpty = (password === "" ? true : false );
  
  if (bUsernameFieldIsEmpty === true || bPasswordFieldIsEmpty === true) {
    var data = {
      objErrors: {}
    }
    if (bUsernameFieldIsEmpty === false) {
      data.objErrors.usernameIsEmpty = {message: "username field cannot be empty." }
    }
    if (bPasswordFieldIsEmpty === false) {
      data.objErrors.passwordIsEmpty = {message: "password field cannot be empty." }
    }
    
    res.render("auth/login.ejs", data);
    return;
  }

  // Stage 2. Find User
  var user = null;
  try {
    user = await userModel.findOne({username: username});
  } catch (error) {
    throw error;
  }
 
  if (user == null) {
    const data = {
      objErrors: {
        bUserDoesNotExist: { message: "Invalid username/password combination."}
      }
    }
    res.render("auth/login.ejs", data);
    return;
  }

  var salt = "keyboard cats";
  var hash = crypto.pbkdf2Sync(password, salt, 10, 512, "sha512").toString("hex");

  if (user.password != hash) {
    const data = {
      objErrors: {
        bInvalidPassword: { message: "Invalid username/password combination."}
      }
    }
    res.render("auth/login.ejs", data);
    return;
  }

  const payload = {
    bUserIsAuthenticated: true,
    user_id: user._id,
    username: user.username,
    email: user.email
  }
  var token = jwt.sign(payload, "keyboard cat", {expiresIn: "1h"});

  // Stage 3. Login User
  res.cookie("jwt", token, {httpOnly: true});
  res.redirect("/");

}

const postRegister = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;

  // Stage 1. Input Data Validation
  const bPasswordsMatch = (password === confirmPassword);

  if (bPasswordsMatch === false) {
    var data = {
      objErrors: {}
    }
    if (bPasswordsMatch === false) {
      data.objErrors.passwordsDoNotMatch = {message: "passwords do not match" }
    }
    
    res.render("auth/register.ejs", data);
    return;
  }

  // Stage 2. Model Validation (provided by mongoose)
  var user = new userModel({username: username, password: password, email: email});
  try {
    await user.validate();
  } catch (error) {
    var data = {
      objRegisterForm: {
        username: username,
        password: password,
        confirmPassword: confirmPassword,
        email: email,
      },
      objErrors: error.errors
    }
    res.render("auth/register.ejs", data)
    return;
  }

  // Stage 3. Crypto
  var salt = "keyboard cats";
  var hash = crypto.pbkdf2Sync(password, salt, 10, 512, "sha512").toString("hex");

  // Stage 4. User Creation / We already did validations, so we can optimize
  user = new userModel({username: username, password: hash, email: email});
  await user.save({validateBeforeSave: false});
  res.redirect("/");
  
}

module.exports = {
  getLoginPage: getLoginPage,
  getRegisterPage: getRegisterPage,
  postLogin: postLogin,
  postRegister: postRegister
}