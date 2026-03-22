// resumeController.js
const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");

async function createResume(req, res, next) {
  try {
    const resume = await Resume.create({ userId: req.user._id, title: req.body.title || "My Resume", status: "draft" });
    res.status(201).json({ success: true, resume });
  } catch (err) { next(err); }
}

async function uploadResume(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    let content = "";
    if (req.file.originalname.endsWith(".pdf")) {
      const data = await pdfParse(req.file.buffer);
      content = data.text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    } else {
      content = req.file.buffer.toString("utf-8");
    }
    if (content.length < 50) return res.status(400).json({ error: "Could not extract content" });
    const resume = await Resume.create({ userId: req.user._id, originalContent: content, status: "uploaded", title: req.body.title || "My Resume" });
    res.json({ success: true, resumeId: resume._id, wordCount: content.split(/\s+/).length });
  } catch (err) { next(err); }
}

async function submitText(req, res, next) {
  try {
    const { content, title } = req.body;
    if (!content || content.length < 50) return res.status(400).json({ error: "Content too short" });
    const resume = await Resume.create({ userId: req.user._id, originalContent: content, status: "uploaded", title: title || "My Resume" });
    res.json({ success: true, resumeId: resume._id });
  } catch (err) { next(err); }
}

async function getResumes(req, res, next) {
  try {
    const resumes = await Resume.find({ userId: req.user._id }, { originalContent: 0 }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) { next(err); }
}

async function getResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json(resume);
  } catch (err) { next(err); }
}

async function updateResume(req, res, next) {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body }, { new: true }
    );
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json({ success: true, resume });
  } catch (err) { next(err); }
}

async function deleteResume(req, res, next) {
  try {
    await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: "Resume deleted" });
  } catch (err) { next(err); }
}

module.exports = { createResume, uploadResume, submitText, getResumes, getResume, updateResume, deleteResume };
