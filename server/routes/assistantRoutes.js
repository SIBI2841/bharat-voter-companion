const express = require('express');
const { GoogleGenAI, HarmCategory, HarmBlockThreshold } = require('@google/genai');
require('dotenv').config();

const router = express.Router();

// Initialize the GenAI SDK with production-ready config
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are the Bharat Voter Companion, an expert AI assistant focused exclusively on the Indian election system. Structure ALL responses in valid JSON format ONLY. Do not use markdown code blocks.",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

router.post('/', async (req, res) => {
  try {
    const { question, userProfile } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    const profile = userProfile || { level: 'Beginner', score: 0, quizzesTaken: 0 };

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: JSON.stringify({
          type: "explanation",
          content: `Simulated: You are level ${profile.level}. The election process involves registering, locating booths, and voting.`,
          engagement: { next_action: "Explore the timeline.", suggestion: "timeline" }
        })
      });
    }

    const prompt = `User Knowledge Level: ${profile.level}. Score: ${profile.score}.
    If the user asks for a quiz, generate questions for ${profile.level} level.
    Structure:
    - Explanation: { "type": "explanation", "content": "...", "engagement": { "next_action": "...", "suggestion": "quiz/flashcards/timeline" } }
    - Quiz: { "type": "quiz", "questions": [ { "question": "...", "options": ["A","B","C","D"], "correct_answer": "...", "explanation": "..." } ] }
    - Flashcards: { "type": "flashcards", "cards": [ { "question": "...", "answer": "...", "category": "..." } ] }
    
    User question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;
