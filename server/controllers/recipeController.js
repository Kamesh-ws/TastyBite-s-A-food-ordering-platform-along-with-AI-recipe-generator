import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const model = await genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

export const generateAIResponse = async (req, res) => {
  const { stage, ingredients, selectedRecipeName } = req.body;
  let prompt;

  // Choose prompt based on the user's stage
  if (stage === "recipe_suggestions") {
    // PROMPT-1: Suggest recipes based on ingredients
    prompt = `Here is a list of ingredients I have available: ${ingredients.join(", ")}. Based on these ingredients, provide a list of 5 possible recipe names I can make. Only list the names without detailed instructions, and make sure they are suitable for a beginner.`;
  } else if (stage === "recipe_instructions" && selectedRecipeName) {
    // PROMPT-2: Provide detailed instructions for the selected recipe
    prompt = `I have selected the recipe: ${selectedRecipeName}. Please provide the following information in a structured format:
1. Title of the recipe.
2. Estimated cooking time in minutes.
3. Ingredients needed as an array.
4. Optional extras (such as spices or flavor enhancers) as a separate list.
5. Detailed, step-by-step instructions for preparing the dish. Make the instructions simple and suitable for a beginner.

Return the response in JSON format.`;
  } else {
    return res.status(400).json({ error: "Invalid stage or missing recipe selection" });
  }

  try {
    const result = await model.generateContent(prompt);
    console.log("Result:", result);
    res.json(result);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
};
