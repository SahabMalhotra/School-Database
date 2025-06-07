const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/Course");
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const students = await Student.find().populate("course");
  const courses = await Course.find();
  res.render("admin/dashboard", { students, courses });
});

module.exports = router;
