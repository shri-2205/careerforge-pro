const Resume = require("../models/Resume");
const aiService = require("../services/aiService");

function toText(r) {
  if (!r) return "";
  let t = `${r.name||""}\n${r.email||""} ${r.phone||""} ${r.location||""}\n\n`;
  if (r.summary) t += `SUMMARY\n${r.summary}\n\n`;
  if (r.experience?.length) { t += "EXPERIENCE\n"; r.experience.forEach(e => { t += `${e.title} at ${e.company} ${e.duration}\n`; (e.bullets||[]).forEach(b => t += `• ${b}\n`); t += "\n"; }); }
  if (r.skills?.length) t += `SKILLS\n${r.skills.join(", ")}\n\n`;
  if (r.projects?.length) { t += "PROJECTS\n"; r.projects.forEach(p => { t += `${p.name}: ${p.description} [${(p.tech||[]).join(", ")}]\n`; }); }
  return t;
}

async function optimizeResume(req, res, next) {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.length < 50) return res.status(400).json({ error: "Job description required" });

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    console.log("🔍 Extracting keywords...");
    const keywords = await aiService.extractKeywords(jobDescription);

    console.log("✍️  Rewriting resume...");
    const structuredResume = await aiService.rewriteResume(resume.originalContent, jobDescription, keywords);

    const optimizedText = toText(structuredResume);

    console.log("📊 Calculating ATS score...");
    const atsScore = await aiService.calculateATSScore(optimizedText, jobDescription, keywords);

    resume.jobDescription = jobDescription;
    resume.extractedKeywords = keywords;
    resume.structuredResume = structuredResume;
    resume.atsScore = atsScore;
    resume.status = "optimized";
    resume.isOptimized = true;
    await resume.save();

    res.json({ success: true, resumeId: resume._id, keywords, structuredResume, atsScore });
  } catch (err) { console.error("Optimization error:", err); next(err); }
}

async function extractKeywords(req, res, next) {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ error: "Job description required" });
    const keywords = await aiService.extractKeywords(jobDescription);
    res.json({ success: true, keywords });
  } catch (err) { next(err); }
}

module.exports = { optimizeResume, extractKeywords };
