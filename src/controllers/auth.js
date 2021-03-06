"use strict";

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cg_validator = require("../../lib/cg_validator/index.js");
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
  const { username, password } = req.body;

  // Stage 1. Input Data Validation
  const bUsernameFieldIsEmpty = cg_validator.isStringEmpty(username);
  const bPasswordFieldIsEmpty = cg_validator.isStringEmpty(username, {ignore_whitespace: false});
  const bValidatorHasErrors = ((bPasswordsMatch === false) || (bEmailIsValid === false));
  if (bValidatorHasErrors) {
    var data = { objErrors: {} }
    if (bUsernameFieldIsEmpty === false) { data.objErrors.usernameIsEmpty = {message: "Username field cannot be empty." } }
    if (bPasswordFieldIsEmpty === false) { data.objErrors.passwordIsEmpty = {message: "Password field cannot be empty." } }
    
    res.render("auth/login.ejs", data);
    return;
  }

  // Stage 2. Find User
  var user = null;
  try {
    user = await userModel.findOne({username: username}).lean();
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
  var token = jwt.sign(payload, "keyboard cats", {expiresIn: "1h"});

  // Stage 3. Login User
  await res.cookie("jwt", token, {httpOnly: true});
  res.redirect("/");

}

const postRegister = async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;

  // Stage 1. Input Data Validation
  const bPasswordsMatch = cg_validator.areStringsEqual(password, confirmPassword);
  const bEmailIsValid = cg_validator.isEmailValid(email);
  const bValidatorHasErrors = ((bPasswordsMatch === false) || (bEmailIsValid === false));
  if (bValidatorHasErrors) {
    var data = { objErrors: {} }
    if (bPasswordsMatch === false) { data.objErrors.passwordsDoNotMatch = {message: "Passwords do not match." } }
    if (bEmailIsValid === false) { data.objErrors.passwordsDoNotMatch = {message: "Email is not valid." } }
    
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

  // Stage 3. Password Hashing
  var salt = "keyboard cats";
  var hash = crypto.pbkdf2Sync(password, salt, 10, 512, "sha512").toString("hex");

  // Stage 4. User Creation / We already did validations, so we can optimize
  user = new userModel({username: username, password: hash, email: email});
  await user.save({validateBeforeSave: false});
  res.redirect("/");
  
}

const postLogout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect('/');
}

module.exports = {
  getLoginPage: getLoginPage,
  getRegisterPage: getRegisterPage,
  postLogin: postLogin,
  postRegister: postRegister,
  postLogout: postLogout
}