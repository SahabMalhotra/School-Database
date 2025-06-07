const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User"); // Make sure this exists

// GET /register
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});
// POST /register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash("error", "Email already registered");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    req.flash("success", "Registration successful. Please login.");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});
// POST /login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/students",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
// GET /logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out.");
    res.redirect("/login");
  });
});

module.exports = router;
