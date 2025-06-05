// OpenRouter API configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Enhanced API key validation
if (!OPENROUTER_API_KEY) {
  throw new Error('OpenRouter API key is missing. Set VITE_OPENROUTER_API_KEY in your .env file');
}

if (typeof OPENROUTER_API_KEY !== 'string' || !OPENROUTER_API_KEY.startsWith('sk-')) {
  throw new Error('Invalid OpenRouter API key format. Key should start with "sk-"');
}

// Add debug logging for API key (safely)
console.log('API Key validation:', {
  exists: Boolean(OPENROUTER_API_KEY),
  length: OPENROUTER_API_KEY.length,
  format: OPENROUTER_API_KEY.startsWith('sk-') ? 'valid' : 'invalid'
});

// Dynamically set the site URL based on environment
const SITE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_PRODUCTION_URL || 'https://vivid-platform.com'
  : 'http://localhost:5173';

console.log('Current environment:', {
  isProd: import.meta.env.PROD,
  siteUrl: SITE_URL
});

const SITE_NAME = 'Vivid Platform';
const MODEL_NAME = 'deepseek/deepseek-prover-v2:free'; // Free model

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
      if (error.status === 401) {
        console.error('Authentication error with OpenRouter API. Please check your API key.');
        throw error;
      }
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

// Common headers and fetch configuration for OpenRouter API
const getFetchConfig = (body) => ({
  method: "POST",
  mode: "cors",
  credentials: "omit",
  headers: {
    "authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "http-referer": SITE_URL,
    "x-title": SITE_NAME,
    "content-type": "application/json",
    "origin": SITE_URL
  },
  body: JSON.stringify(body)
});

// Create a chat session
export const startChat = async () => {
  try {
    console.log('Attempting to start chat with config:', {
      url: SITE_URL,
      keyLength: OPENROUTER_API_KEY.length,
      model: MODEL_NAME
    });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", 
      getFetchConfig({
        model: MODEL_NAME,
        temperature: 0.7,
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: "Hello! I'd like to learn more about the Vivid platform."
          }
        ]
      })
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers)
      });
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your OpenRouter API key');
      }
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
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
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", 
        getFetchConfig({
          model: MODEL_NAME,
          temperature: 0.7,
          max_tokens: 1000,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...messages,
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          headers: Object.fromEntries(response.headers)
        });
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your OpenRouter API key');
        }
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
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
