const express = require("express");
const router = express.Router();

const Suggestion = require("../models/Suggestion");

router.get("/suggestions", async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];

    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    return res.json(suggestions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;