const express = require("express");
const { createUser, loginUser, checkUser, checkAuth } = require("../controller/auth");
const passport = require("passport");

const router = express.Router();
// Brands is already added in base path
router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"),checkAuth);

exports.router = router;
