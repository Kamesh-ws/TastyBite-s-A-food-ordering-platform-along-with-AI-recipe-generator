import express from 'express';
import { generateAIResponse } from '../controllers/recipeController.js';

const router = express.Router();

// Route to handle AI response generation
router.post('/ai-recipe', generateAIResponse);

export default router;