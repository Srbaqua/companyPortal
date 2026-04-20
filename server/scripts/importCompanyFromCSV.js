require("dotenv").config();

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

const Company = require("../src/models/Company");
const normalize = require("../src/utils/normalize");

const importCompanies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const results = [];
    const filePath = path.join(__dirname, "../data/companies.csv");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const companyName = row.company_name || row.name || Object.values(row)[0];

        if (companyName && companyName.trim()) {
          results.push({
            name: companyName.trim(),
            normalizedName: normalize(companyName)
          });
        }
      })
      .on("end", async () => {
        const ops = results.map((company) => ({
          updateOne: {
            filter: { normalizedName: company.normalizedName },
            update: { $setOnInsert: company },
            upsert: true
          }
        }));

        if (ops.length > 0) {
          const result = await Company.bulkWrite(ops);
          console.log("Import complete:", result);
        } else {
          console.log("No companies found in CSV.");
        }

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
      });
  } catch (error) {
    console.error("Import failed:", error.message);
    process.exit(1);
  }
};

importCompanies();