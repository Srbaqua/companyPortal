const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    normalizedName: { type: String, required: true },
    studentName: { type: String, required: true },
    branch: { type: String, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "duplicate"],
      default: "new"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);