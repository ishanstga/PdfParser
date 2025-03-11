// models/PdfFile.js
const mongoose = require("mongoose");

const PdfFileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  pdf: {
    type: Buffer,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PdfFile", PdfFileSchema);
