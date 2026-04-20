require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const suggestRoutes = require("./routes/suggest");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Company Portal API is running");
});

app.use("/api/suggestions", suggestRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});