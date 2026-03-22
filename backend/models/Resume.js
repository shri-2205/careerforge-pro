const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "My Resume" },
  template: { type: String, default: "modern", enum: ["modern", "classic", "minimal", "executive"] },
  originalContent: { type: String, default: "" },
  jobDescription: { type: String, default: "" },
  extractedKeywords: {
    skills: [String], tools: [String],
    responsibilities: [String], softSkills: [String],
    jobTitle: String, experienceLevel: String, industry: String,
  },
  structuredResume: {
    name: String, email: String, phone: String,
    location: String, linkedin: String, github: String, summary: String,
    experience: [{ title: String, company: String, duration: String, bullets: [String] }],
    education: [{ degree: String, institution: String, year: String, gpa: String }],
    skills: [String], certifications: [String], projects: [{ name: String, description: String, tech: [String] }],
  },
  atsScore: {
    overall: { type: Number, default: 0 },
    keywordMatch: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    readability: { type: Number, default: 0 },
    missingKeywords: [String], presentKeywords: [String],
    suggestions: [String], verdict: String,
  },
  status: { type: String, enum: ["draft", "uploaded", "optimized"], default: "draft" },
  isOptimized: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
