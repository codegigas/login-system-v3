"use strict";

const jwt = require("jsonwebtoken");

const sessionWithJWT = (options) => {
  var opts = options || {}
  var token_key = opts.token_key || "jwt";
  var token_secret = opts.token_secret || "keyboard cats";

  return (req, res, next) => {
    req.session = {
      bUserIsAuthenticated: false,
      username: "Guest"
    };
    res.locals = {
      bUserIsAuthenticated: false,
      username: "Guest"
    }

    if (!req.cookies[token_key]) {
      next();
      return;
    }

    var token = req.cookies[token_key];
    var payload = null;
    try {
      payload = jwt.verify(token, token_secret);
    } catch (err) {
      res.clearCookie(token_key);
      next();
      return;
    }
    
    req.session = {
      bUserIsAuthenticated: true,
      user_id: payload.id,
      username: payload.username
    }

    res.locals = {
      bUserIsAuthenticated: true,
      user_id: payload.id,
      username: payload.username
    }

    next();
  }

}

module.exports = sessionWithJWT;