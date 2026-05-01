const express = require('express');
const { createGoogleGenerativeAI } = require('@google/genai');
require('dotenv').config();

const router = express.Router();

// Initialize the high-speed GenAI SDK
const genAI = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const prompt = `You are the Bharat Voter Companion. 
    User Knowledge Level: ${profile.level}.
    If the user asks for a quiz, generate questions for ${profile.level} level.
    Structure ALL responses in valid JSON format ONLY. Do not use markdown code blocks.
    
    Structure:
    - Explanation: { \"type\": \"explanation\", \"content\": \"...\", \"engagement\": { \"next_action\": \"...\", \"suggestion\": \"quiz/flashcards/timeline\" } }
    - Quiz: { \"type\": \"quiz\", \"questions\": [ { \"question\": \"...\", \"options\": [\"A\",\"B\",\"C\",\"D\"], \"correct_answer\": \"...\", \"explanation\": \"...\" } ] }
    - Flashcards: { \"type\": \"flashcards\", \"cards\": [ { \"question\": \"...\", \"answer\": \"...\", \"category\": \"...\" } ] }
    
    User question: ${question}`;

    // Using the fastest available model with the high-speed SDK
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
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
