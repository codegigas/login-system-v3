"use strict";

const isAuthenticated = (req, res, next) => {
  if (!req.session) {
    res.redirect("/auth/login");
    return;
  }
  if (req.session.bUserIsAuthenticated == false) {
    res.redirect("/auth/login");
    return;
  }
  next();

}

module.exports = isAuthenticated;