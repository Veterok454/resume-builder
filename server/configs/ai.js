import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const callAIService = async (
  prompt,
  systemMessage = '',
  maxTokens = 500
) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemMessage || 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};

export default { callAIService };
