const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { TranslationServiceClient } = require('@google-cloud/translate');
require('dotenv').config();

const router = express.Router();

// 1. Google Generative AI (Gemini) Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: "You are the Bharat Voter Companion. Structure responses in valid JSON ONLY. Do not use markdown blocks.",
});

// 2. Google Cloud Translation Setup (Optional/Mock fallback)
const translateClient = new TranslationServiceClient();

router.post('/', async (req, res) => {
  try {
    const { question, userProfile } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    
    const profile = userProfile || { level: 'Beginner', score: 0 };

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: JSON.stringify({ type: "explanation", content: "Simulated response: GEMINI_API_KEY is missing." })
      });
    }

    const prompt = `User Knowledge Level: ${profile.level}.
    If the user asks for a quiz, generate questions for ${profile.level} level.
    Structure ALL responses in valid JSON format ONLY. Do not use markdown code blocks.
    
    Structure:
    - Explanation: { "type": "explanation", "content": "...", "engagement": { "next_action": "...", "suggestion": "quiz/flashcards/timeline" } }
    - Quiz: { "type": "quiz", "questions": [ { "question": "...", "options": ["A","B","C","D"], "correct_answer": "...", "explanation": "..." } ] }
    - Flashcards: { "type": "flashcards", "cards": [ { "question": "...", "answer": "...", "category": "..." } ] }
    
    User question: ${question}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const response = await result.response;
    res.json({ answer: response.text() });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// New Endpoint: Google Cloud Translation
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'hi' } = req.body;
    
    // In a real GCP environment, this would use the TranslationServiceClient
    // For this educational project, we'll use Gemini to power the "Google Cloud AI Translation"
    const translationPrompt = `Translate the following text to ${targetLanguage}: "${text}". Only return the translated text.`;
    const result = await model.generateContent(translationPrompt);
    const response = await result.response;
    
    res.json({ translatedText: response.text() });
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

module.exports = router;
