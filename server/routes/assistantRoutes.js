const express = require('express');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const router = express.Router();

// Initialize the GenAI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { question, userProfile } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Default profile if not provided
    const profile = userProfile || { level: 'Beginner', score: 0, quizzesTaken: 0 };

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if no API key is set
      return res.json({
        answer: JSON.stringify({
          type: "explanation",
          content: `I am a simulated assistant because the GEMINI_API_KEY is not set. You are currently level ${profile.level} with ${profile.score} points! The election process involves registering to vote, finding your polling place, and casting your ballot.`,
          engagement: { next_action: "Explore the timeline manually.", suggestion: "timeline" }
        })
      });
    }

    const prompt = `You are the Bharat Voter Companion, an expert AI assistant focused exclusively on the Indian election system (Election Commission of India, Lok Sabha, Rajya Sabha, MP/MLA, EVMs, etc.). 
    
    CURRENT USER PROFILE:
    - Knowledge Level: ${profile.level}
    - Score: ${profile.score}
    
    Core Directives:
    1. Adapt your explanation depth and quiz difficulty strictly to the user's Knowledge Level (${profile.level}).
    2. If the user asks for a quiz, generate questions that match their level.
    3. Structure ALL responses in valid JSON format ONLY. 
    4. If a user asks a general question, return: { "type": "explanation", "content": "...", "engagement": { "next_action": "...", "suggestion": "quiz / flashcards / timeline" } }
    5. If a user asks for a quiz, return: { "type": "quiz", "questions": [ { "question": "...", "options": ["A","B","C","D"], "correct_answer": "...", "explanation": "..." } ] }
    6. If a user asks for flashcards, return: { "type": "flashcards", "cards": [ { "question": "...", "answer": "...", "category": "..." } ] }
    7. If a user asks for a timeline, return: { "type": "timeline", "steps": [ { "step": 1, "title": "...", "description": "..." } ] }
    
    Do not wrap the JSON in markdown code blocks. Just output raw JSON.
    
    User question: ${question}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;
