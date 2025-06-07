const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start GitHub OAuth
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub Callback
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Logged in with GitHub");
    res.redirect("/students");
  }
);

module.exports = router;
