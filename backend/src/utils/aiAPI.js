import "dotenv/config";
import fetch from "node-fetch";
export async function getAIResponse(userMessage) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-235b-a22b-2507:free",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful and concise assistant. Limit responses to under 200 words. Answer in a clear, complete paragraph. Do not use bullet points.",
          },

          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 200,
      }),
    }
  );

  const data = await response.json();
  console.log(data);
  return data?.choices?.[0]?.message?.content?.trim() || null;
}
