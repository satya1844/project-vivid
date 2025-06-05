// Test OpenRouter API key
async function testOpenRouterAPI() {
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "mistralai/mistral-7b-instruct",
        "messages": [{"role": "user", "content": "Say hello"}]
      })
    });

    const data = await response.text();
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      data
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

testOpenRouterAPI();
