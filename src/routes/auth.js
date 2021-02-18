"use strict";

const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.js");

router.get("/auth/login", authController.getLoginPage);
router.get("/auth/register", authController.getRegisterPage);
router.get("/auth/logout", authController.postLogout);
router.post("/auth/login", authController.postLogin);
router.post("/auth/register", authController.postRegister);

module.exports = {
  routes: router,
};