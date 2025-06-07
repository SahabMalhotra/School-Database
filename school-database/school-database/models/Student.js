const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  contact: String,
  address: String,
  dob: Date,
  gender: String,
  guardianName: String,
});

module.exports = mongoose.model("Student", studentSchema);
