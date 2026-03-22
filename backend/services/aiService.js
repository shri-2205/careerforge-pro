const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

function safeParseJSON(text) {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

async function chat(content, maxTokens = 1500) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content }],
    temperature: 0.3,
    max_tokens: maxTokens,
  });
  return response.choices[0]?.message?.content || "";
}

async function extractKeywords(jobDescription) {
  const text = await chat(`Analyze this job description and extract keywords.

JOB DESCRIPTION:
"""${jobDescription}"""

Return ONLY valid JSON (no markdown):
{
  "skills": ["skill1","skill2"],
  "tools": ["tool1","tool2"],
  "responsibilities": ["resp1","resp2"],
  "softSkills": ["skill1","skill2"],
  "jobTitle": "title",
  "experienceLevel": "junior/mid/senior",
  "industry": "industry"
}`, 800);
  return safeParseJSON(text);
}

async function rewriteResume(originalResume, jobDescription, extractedKeywords) {
  const kw = [...(extractedKeywords.skills||[]), ...(extractedKeywords.tools||[])].slice(0,15).join(", ");
  const text = await chat(`You are a professional resume writer. Rewrite this resume for ATS optimization.

ORIGINAL RESUME:
"""${originalResume}"""

JOB DESCRIPTION:
"""${jobDescription}"""

KEYWORDS TO USE: ${kw}

Rules:
- Use strong action verbs for bullets
- Add metrics where reasonable  
- Include keywords naturally
- Do NOT fabricate companies or degrees

Return ONLY valid JSON (no markdown):
{
  "name":"Full Name",
  "email":"email@example.com",
  "phone":"+91-00000-00000",
  "location":"City, State",
  "linkedin":"linkedin.com/in/username",
  "github":"github.com/username",
  "summary":"2-3 sentence optimized summary",
  "experience":[{"title":"Job Title","company":"Company","duration":"Jan 2022 - Present","bullets":["bullet1","bullet2"]}],
  "education":[{"degree":"B.E. Computer Science","institution":"University","year":"2024","gpa":"8.5"}],
  "skills":["skill1","skill2"],
  "certifications":["cert1"],
  "projects":[{"name":"Project Name","description":"What it does","tech":["React","Node.js"]}]
}`, 2500);
  return safeParseJSON(text);
}

async function calculateATSScore(resumeContent, jobDescription, extractedKeywords) {
  const allKeywords = [...(extractedKeywords.skills||[]), ...(extractedKeywords.tools||[]), ...(extractedKeywords.softSkills||[])];
  const resumeLower = resumeContent.toLowerCase();
  const presentKeywords = allKeywords.filter(kw => resumeLower.includes(kw.toLowerCase()));
  const missingKeywords = allKeywords.filter(kw => !resumeLower.includes(kw.toLowerCase()));
  const keywordMatchScore = Math.round((presentKeywords.length / Math.max(allKeywords.length, 1)) * 100);

  const text = await chat(`You are an ATS scoring engine. Score this resume.

RESUME: """${resumeContent.slice(0,2000)}"""
JOB DESCRIPTION: """${jobDescription.slice(0,1500)}"""
KEYWORD MATCH: ${keywordMatchScore}%

Return ONLY valid JSON (no markdown):
{
  "overall":75,
  "keywordMatch":${keywordMatchScore},
  "formatting":80,
  "readability":75,
  "suggestions":["Add Docker to skills","Quantify achievements with metrics","Include AWS experience"],
  "verdict":"Moderate Match"
}`, 500);

  let aiScore;
  try { aiScore = safeParseJSON(text); }
  catch { aiScore = { overall: keywordMatchScore, formatting: 70, readability: 70, suggestions: ["Add more JD keywords"], verdict: "Moderate Match" }; }

  return {
    overall: aiScore.overall || keywordMatchScore,
    keywordMatch: keywordMatchScore,
    formatting: aiScore.formatting || 70,
    readability: aiScore.readability || 70,
    suggestions: aiScore.suggestions || [],
    verdict: aiScore.verdict || "Moderate Match",
    missingKeywords: missingKeywords.slice(0, 15),
    presentKeywords: presentKeywords.slice(0, 15),
  };
}

module.exports = { extractKeywords, rewriteResume, calculateATSScore };
