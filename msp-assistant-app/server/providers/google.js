import { BaseLLMProvider } from './base.js';

export class GoogleProvider extends BaseLLMProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'google';
    this.apiKey = config.apiKey || process.env.GOOGLE_API_KEY;
    this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com';
    this.models = [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable Gemini model' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and efficient' },
      { id: 'gemini-pro', name: 'Gemini Pro', description: 'Balanced performance' }
    ];
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async chat({ messages, systemPrompt, model, maxTokens = 4000 }) {
    if (!this.isConfigured()) {
      throw new Error('Google API key not configured');
    }

    const selectedModel = model || this.models[0].id;

    // Convert messages to Gemini format
    const geminiContents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }]
    }));

    const response = await fetch(
      `${this.baseUrl}/v1beta/models/${selectedModel}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: geminiContents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Google API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      content: content.trim(),
      model: selectedModel,
      provider: this.name,
      usage: data.usageMetadata
    };
  }
}
