const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/Course");
const { ensureAuthenticated } = require("../middleware/auth");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// 🔓 Public — Show add form
router.get("/students/add", async (req, res) => {
  const courses = await Course.find();
  res.render("students/add", { courses });
});

// 🔓 Public — Submit new student
router.post("/students/add", async (req, res) => {
  const { name, email, contact, address, dob, gender, guardianName, course } =
    req.body;
  try {
    await Student.create({
      name,
      email,
      contact,
      address,
      dob,
      gender,
      guardianName,
      course,
    });
    req.flash("success", "Student registered successfully!");
    res.redirect("/students");
  } catch (err) {
    if (err.code === 11000) {
      req.flash("error", "Email already exists. Please use a different one.");
    } else {
      req.flash("error", "Something went wrong. Please try again.");
    }
    res.redirect("/students/add");
  }
});

// 🔐 Protected — View list
router.get("/students", async (req, res) => {
  const students = await Student.find().populate("course");
  res.render("students/list", { students, user: req.user });
});

// 🔐 Protected — Edit form
router.get("/students/edit/:id", ensureAuthenticated, async (req, res) => {
  const student = await Student.findById(req.params.id);
  const courses = await Course.find();
  res.render("students/edit", { student, courses });
});

// 🔐 Protected — Update logic
router.post("/students/edit/:id", ensureAuthenticated, async (req, res) => {
  const { name, email, contact, course } = req.body;
  await Student.findByIdAndUpdate(req.params.id, {
    name,
    email,
    contact,
    course,
  });
  req.flash("success", "Student updated.");
  res.redirect("/students");
});

// 🔐 Protected — Confirm delete
router.get("/students/delete/:id", ensureAuthenticated, async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("students/delete", { student });
});

// 🔐 Protected — Delete logic
router.post("/students/delete/:id", ensureAuthenticated, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  req.flash("success", "Student deleted.");
  res.redirect("/students");
});

// 🔐 Protected — Export to Excel
router.get("/students/export/excel", ensureAuthenticated, async (req, res) => {
  const students = await Student.find().populate("course");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Students");

  worksheet.columns = [
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Contact", key: "contact" },
    { header: "Course", key: "course" },
  ];

  students.forEach((student) => {
    worksheet.addRow({
      name: student.name,
      email: student.email,
      contact: student.contact,
      course: student.course?.title || "N/A",
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});

// 🔐 Protected — Export to PDF
router.get("/students/export/pdf", ensureAuthenticated, async (req, res) => {
  const students = await Student.find().populate("course");

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=students.pdf");

  doc.pipe(res);
  doc.fontSize(18).text("Student List", { underline: true });
  doc.moveDown();

  students.forEach((s) => {
    doc.fontSize(12).text(`Name: ${s.name}`);
    doc.text(`Email: ${s.email}`);
    doc.text(`Contact: ${s.contact}`);
    doc.text(`Course: ${s.course?.title || "N/A"}`);
    doc.moveDown();
  });

  doc.end();
});

module.exports = router;
