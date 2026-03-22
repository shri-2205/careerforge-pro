const express = require('express')
const r = express.Router()
const { protect } = require('../middleware/authMiddleware')
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const MODEL = 'llama-3.3-70b-versatile'

// POST /api/ai/cover-letter
r.post('/cover-letter', protect, async (req, res, next) => {
  try {
    const { jobTitle, company, jd, resumeText, tone = 'professional' } = req.body
    const toneDesc = { professional: 'formal and professional', enthusiastic: 'enthusiastic and passionate', concise: 'brief and direct' }[tone] || 'professional'

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{
        role: 'user',
        content: `Write a ${toneDesc} cover letter for the following:

Job Title: ${jobTitle}
Company: ${company}

Job Description:
${jd}

Candidate's Resume Highlights:
${resumeText}

Write a compelling, personalized cover letter that:
1. Opens with a strong hook
2. Highlights relevant experience matching the JD
3. Shows enthusiasm for the company
4. Closes with a clear call to action
5. Is 3-4 paragraphs, under 350 words

Return ONLY the cover letter text, no extra commentary.`
      }],
      temperature: 0.7, max_tokens: 800,
    })
    const letter = response.choices[0]?.message?.content || ''
    res.json({ success: true, letter })
  } catch (err) { next(err) }
})

// POST /api/ai/interview-questions
r.post('/interview-questions', protect, async (req, res, next) => {
  try {
    const { jd, resumeText } = req.body

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{
        role: 'user',
        content: `Generate 12 interview questions based on this resume and job description.

Resume: ${resumeText}
Job Description: ${jd}

Return ONLY valid JSON array (no markdown):
[
  { "question": "question text", "category": "Technical", "tip": "how to answer this well" },
  { "question": "...", "category": "Behavioral", "tip": "..." }
]

Categories must be exactly: Technical, Behavioral, Situational, Role-Specific
Generate 3 questions per category. Include practical answer tips.`
      }],
      temperature: 0.5, max_tokens: 1500,
    })

    let text = response.choices[0]?.message?.content || '[]'
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const questions = JSON.parse(text)
    res.json({ success: true, questions })
  } catch (err) { next(err) }
})

module.exports = r
