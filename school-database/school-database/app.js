var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./config/passport")(passport); // if you're using a passport setup file

const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
const hbs = require("hbs");
hbs.registerPartials(path.join(__dirname, "/views/partials"));
hbs.registerHelper("isSelected", function (courseId, selectedId) {
  return courseId.toString() === selectedId?.toString() ? "selected" : "";
});
hbs.registerHelper("formatDate", function (date) {
  return new Date(date).toLocaleDateString();
});
hbs.registerHelper("year", () => new Date().getFullYear());

app.use(logger("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Make flash messages available in views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", userRoutes);
app.use("/users", usersRouter);
app.use("/", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/", authRoutes);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.use((req, res, next) => {
  console.log("⚠️ Route not found:", req.originalUrl);
  next(createError(404));
});

module.exports = app;
