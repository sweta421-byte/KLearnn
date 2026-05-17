import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  async generateHint(question: string, subject: string): Promise<string> {
    try {
      const apiKey = process.env.GEMINI_API_KEY;

      const prompt = `
You are an AI tutor.

Rules:
- Give hints only
- No direct answers
- Keep answers short

Subject: ${subject}
Question: ${question}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        },
      );

      const data = await response.json();

      console.log('Gemini API Response:', data);

      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No AI response generated.'
      );
    } catch (error: any) {
      console.error('Gemini REST Error:', error);

      return error?.message || 'Unknown error';
    }
  }
}