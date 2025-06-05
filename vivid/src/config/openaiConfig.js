import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  }
});

export const generateChatCompletion = async (messages) => {
  try {
    const response = await openaiApi.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant for the Vivid platform, a social network that helps people connect based on shared interests and skills. 
          While you can discuss any topic, you have special knowledge about the Vivid platform's features including:
          - User profiles and dashboard
          - Community groups and discussions
          - Skill sharing and learning opportunities
          - Making connections with other users
          Keep responses friendly, concise, and engaging. When discussing non-platform topics, maintain natural conversation while being ready to help with platform-specific queries.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};
