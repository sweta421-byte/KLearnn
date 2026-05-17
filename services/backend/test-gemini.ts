import { GeminiService } from './src/ai/gemini.service';

async function testGemini() {
  const geminiService = new GeminiService();
  const result = await geminiService.generateHint('Explain Pythagoras theorem', 'Mathematics');
  console.log('AI Response:', result);
}

testGemini().catch(console.error);