function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in to view that page.");
  res.redirect("/login");
}

module.exports = { ensureAuthenticated };
