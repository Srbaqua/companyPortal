const express = require("express");
const router = express.Router();

const Company = require("../models/Company");
const Suggestion = require("../models/Suggestions");
const normalize = require("../utils/normalize");

router.post("/", async (req, res) => {
  try {
    const { companyName, studentName, branch, reason } = req.body;

    if (!companyName || !studentName || !branch) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const normalizedName = normalize(companyName);

    //  1. Check if already suggested before
    const alreadySuggested = await Suggestion.findOne({ normalizedName });

    if (alreadySuggested) {
      return res.json({
        message: "This company has already been suggested."
      });
    }

    //  2. Check if already exists in main company list
    const existingCompany = await Company.findOne({ normalizedName });

    const status = existingCompany ? "duplicate" : "new";

    await Suggestion.create({
      companyName: companyName.trim(),
      normalizedName,
      studentName: studentName.trim(),
      branch: branch.trim(),
      reason: reason?.trim() || "",
      status
    });

    return res.json({
      message: existingCompany
        ? "This company is already in our database."
        : "Suggestion submitted successfully."
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;