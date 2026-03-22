const express = require("express");
const r = express.Router();
const { optimizeResume, extractKeywords } = require("../controllers/analysisController");
const { protect } = require("../middleware/authMiddleware");
r.use(protect);
r.post("/keywords", extractKeywords);
r.post("/optimize/:id", optimizeResume);
module.exports = r;
