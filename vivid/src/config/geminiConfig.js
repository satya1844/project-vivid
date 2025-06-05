import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug log to verify API key (remove in production)
console.log('API Key loaded:', GEMINI_API_KEY ? 'Yes (length: ' + GEMINI_API_KEY.length + ')' : 'No');

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initialize the chat model
const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-pro-002", // Latest stable Pro model
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1000,
  }
});

const systemPrompt = {
  role: "user",
  parts: [{ 
    text: `You are an AI assistant for the Vivid platform, a social network that helps people connect based on shared interests and skills. 
    You should be friendly, helpful, and knowledgeable about the platform's features including:
    - User profiles and dashboard
    - Community groups and discussions
    - Skill sharing and learning opportunities
    - Making connections with other users
    While you can discuss any topic, always maintain context of being a Vivid platform assistant.
    Respond in a conversational, engaging manner.`
  }]
};

// Create a chat session
export const startChat = async () => {
  try {
    // Initialize chat with system prompt
    const chat = model.startChat();
    
    // Send the system prompt with retry mechanism
    await retryWithBackoff(async () => {
      await chat.sendMessage(systemPrompt.parts[0].text);
    });

    // Get initial response with retry mechanism
    await retryWithBackoff(async () => {
      const result = await chat.sendMessage("Hello! I'd like to learn more about the Vivid platform.");
      await result.response;
    });
    
    return chat;
  } catch (error) {
    console.error('Error starting chat:', error);
    throw error;
  }
};

// Utility function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to handle retries with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        retries++;
        if (retries === maxRetries) throw error;
        const waitTime = initialDelay * Math.pow(2, retries - 1);
        console.log(`Rate limit hit, retrying in ${waitTime/1000} seconds...`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
};

// Generate a response
export const generateResponse = async (chat, message) => {
  if (!chat) {
    throw new Error('Chat session not initialized');
  }
  
  try {
    const result = await retryWithBackoff(async () => {
      const result = await chat.sendMessage(message);
      return result;
    });
    const response = await result.response;
    return response.text();
  } catch (error) {
    if (error.message?.includes('quota')) {
      throw new Error('Rate limit exceeded. Please try again in a few minutes.');
    }
    console.error('Error generating response:', error);
    throw error;
  }
};
