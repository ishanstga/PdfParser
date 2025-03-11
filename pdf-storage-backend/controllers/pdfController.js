// controllers/pdfController.js
const { upload } = require("../config/db");
const PdfFile = require("../models/PdfFile");

const uploadPDF = upload.single("pdf");

const handleUpload = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^07\d{8}$/.test(phone);

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePhone(phone)) {
      return res
        .status(400)
        .json({ message: "Phone must start with 07 and have 10 digits" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    const newPdf = new PdfFile({
      name,
      email,
      phone,
      fileName: req.file.originalname,
      pdf: req.file.buffer,
    });

    const savedPdf = await newPdf.save();

    res.status(201).json({
      message: "File uploaded successfully",
      id: savedPdf._id,
      fileName: savedPdf.fileName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPDFs = async (req, res) => {
  try {
    const pdfs = await PdfFile.find();
    res.status(200).json(pdfs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await PdfFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(
        file.fileName
      )}"`,
    });

    res.end(file.pdf);
  } catch (error) {
    console.error("Download error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = {
  uploadPDF: [uploadPDF, handleUpload],
  getPDFs,
  downloadFile,
};
