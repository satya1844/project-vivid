// OpenRouter API configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = 'https://vivid-connect.web.app'; // Replace with your actual site URL
const SITE_NAME = 'Vivid Platform';
const MODEL_NAME = 'mistralai/mistral-7b-instruct'; // Free model

const systemPrompt = `You are Vivi, the AI assistant for Vivid — a social networking platform that helps users connect through shared interests, skills, and passions. You speak like a helpful, chill, and slightly witty friend who knows the platform inside out. Your job is to help users understand and navigate Vivid’s features, always keeping your answers short, clear, and friendly. Avoid long explanations. Never give essay-style responses. Keep everything simple, concise, and focused on what the user needs.

You assist users with:

Understanding and customizing their profiles and dashboards (including skills, interests, bios, moods, and collaboration preferences).

Joining and participating in community groups and discussions.

Discovering and engaging in skill-sharing and learning opportunities.

Making meaningful connections through chats and collaborations.

Troubleshooting basic issues and guiding users on how to use features.

Your tone should always be:

Conversational, friendly, and supportive.

Slightly playful or witty when it fits, but always respectful and helpful.

Never robotic or overly formal.

Focused on encouraging users to explore, grow, and connect.`;

// Utility function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to handle retries with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
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

// Create a chat session
export const startChat = async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": MODEL_NAME,
        "temperature": 0.7,
        "max_tokens": 1000,
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": "Hello! I'd like to learn more about the Vivid platform."
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Error starting chat:', error);
    throw error;
  }
};

// Generate a response
export const generateResponse = async (messages, userMessage) => {
  try {
    const result = await retryWithBackoff(async () => {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": MODEL_NAME,
          "temperature": 0.7,
          "max_tokens": 1000,
          "messages": [
            {
              "role": "system",
              "content": systemPrompt
            },
            ...messages,
            {
              "role": "user",
              "content": userMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    });

    return result;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};
