const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");

const Company = require("../models/Company");
const Suggestion = require("../models/Suggestions"); 
const normalize = require("../utils/normalize");

// 🔐 Common Auth Function
const isAuthorized = (req) => {
  const key = req.headers["x-admin-key"];
  return key === process.env.ADMIN_KEY;
};

//
// ====================== GET ALL SUGGESTIONS ======================
//
router.get("/suggestions", async (req, res) => {
  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    return res.json(suggestions);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//
// ====================== EXPORT SUGGESTIONS ======================
//
router.get("/export/suggestions", async (req, res) => {
  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const suggestions = await Suggestion.find({
  status: { $in: ["new", "duplicate"] }
});

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Suggestions");

    sheet.columns = [
      { header: "Company", key: "companyName", width: 25 },
      { header: "Student", key: "studentName", width: 20 },
      { header: "Branch", key: "branch", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Reason", key: "reason", width: 30 }
    ];

    suggestions.forEach((s) => {
      sheet.addRow(s.toObject());
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=suggestions.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
});

//
// ====================== EXPORT COMPANIES ======================
//
router.get("/export/companies", async (req, res) => {
  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const companies = await Company.find();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Companies");

    sheet.columns = [
      { header: "Company Name", key: "name", width: 30 }
    ];

    companies.forEach((c) => {
      sheet.addRow({ name: c.name });
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=companies.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
});

//
// ====================== ACCEPT ======================
//
router.post("/accept/:id", async (req, res) => {
  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    const exists = await Company.findOne({
      normalizedName: suggestion.normalizedName
    });

    if (!exists) {
      await Company.create({
        name: suggestion.companyName,
        normalizedName: suggestion.normalizedName
      });
    }

    suggestion.status = "approved";
    await suggestion.save();

    res.json({ message: "Company added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//
// ====================== REJECT ======================
//
router.post("/reject/:id", async (req, res) => {
  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Suggestion.findByIdAndUpdate(req.params.id, {
      status: "rejected"
    });

    res.json({ message: "Rejected successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;