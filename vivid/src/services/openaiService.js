import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should proxy through your backend
});

export const generateChatResponse = async (message, context = '') => {
  try {
    const basePrompt = `You are a helpful AI assistant for the Vivid platform - a social platform for connecting people with shared interests and skills. 
    You can discuss any topic while staying relevant to the platform's context when needed.
    
    Previous context: ${context}
    
    User message: ${message}
    
    Please provide a helpful, engaging, and natural response. If the question is about the Vivid platform, provide specific guidance about platform features.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful and knowledgeable AI assistant for the Vivid platform, but you can also engage in general conversations about any topic while maintaining awareness of the platform context."
        },
        {
          role: "user",
          content: basePrompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    });

    return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
};
