const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { ensureAuthenticated } = require("../middleware/auth");

// Show all courses (admin view)
router.get("/", ensureAuthenticated, async (req, res) => {
  const courses = await Course.find();
  res.render("courses/list", { courses });
});

// Add course (admin only)
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("courses/add");
});

router.post("/add", ensureAuthenticated, async (req, res) => {
  const { title, code } = req.body;
  await Course.create({ title, code });
  res.redirect("/courses");
});

module.exports = router;
