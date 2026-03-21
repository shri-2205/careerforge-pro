const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Vite port 5173
app.use(cors({ 
  origin: "*", 
  credentials: true 
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/ai", aiRoutes);
// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use(errorHandler);

// ✅ TLS options for MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => { 
    console.error("❌ MongoDB failed:", err.message); 
    process.exit(1); 
  });

module.exports = app;