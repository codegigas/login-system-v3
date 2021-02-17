"use strict";

const getHomePage = (req, res) => {
  const data = {
    bUserIsAuthenticated: req.session.bUserIsAuthenticated,
    username: req.session.username
  }

  res.render("home.ejs", data);
}

module.exports = {
  getHomePage: getHomePage,
}