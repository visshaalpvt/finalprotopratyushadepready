/**
 * aiService.js
 * Handles interaction with local Ollama Llama3 model.
 */
import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

export const aiService = {
  /**
   * Generates a bullet-point summary of the transcript.
   */
  async generateSummary(text) {
    if (!text || text.length < 50) {
      return "Transcript is too short to generate a summary.";
    }

    try {
      const prompt = `Synthesize the following lecture transcript into 5 clear, professional bullet points for students with learning disabilities. Focus on key definitions and core concepts: \n\n${text}\n\nSummary:`;
      
      const response = await axios.post(OLLAMA_URL, {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false
      });

      return response.data.response;
    } catch (err) {
      console.error('[AI] Summary generation failed:', err.message);
      return "AI Summary is currently unavailable. Please review the live transcript.";
    }
  },

  /**
   * Simplifies a complex concept (ELIF pattern).
   */
  async simplifyConcept(concept) {
    try {
      const prompt = `Explain the following educational concept very simply, as if explaining to a 5-year old, using clear analogies: \n\n${concept}`;
      
      const response = await axios.post(OLLAMA_URL, {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false
      });

      return response.data.response;
    } catch (err) {
      return "Simple explanation unavailable.";
    }
  },

  /**
   * AI Learning Assistant: Answers a student's question based on context.
   */
  async answerQuestion(question, contextText) {
    try {
      const prompt = `You are a helpful AI Learning Assistant in an inclusive classroom. Answer the student's question clearly, concisely, and encouragingly. Use the provided lecture transcript as context if helpful.
      
      Lecture Context:
      ${contextText}
      
      Student's Question:
      ${question}
      
      Answer:`;
      
      const response = await axios.post(OLLAMA_URL, {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false
      });

      return response.data.response;
    } catch (err) {
      console.error('[AI] QA generation failed:', err.message);
      return "I'm having trouble thinking right now. Please ask your teacher!";
    }
  }
};
