import { BaseLLMProvider } from './base.js';

export class OpenAIProvider extends BaseLLMProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'openai';
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.baseUrl = config.baseUrl || 'https://api.openai.com';
    this.models = [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable, multimodal' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Fast and capable' },
      { id: 'gpt-4', name: 'GPT-4', description: 'Original GPT-4' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and economical' }
    ];
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async chat({ messages, systemPrompt, model, maxTokens = 4000 }) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured');
    }

    const selectedModel = model || this.models[0].id;

    // Convert messages to OpenAI format
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
      }))
    ];

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: openaiMessages,
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    return {
      content: content.trim(),
      model: selectedModel,
      provider: this.name,
      usage: data.usage
    };
  }
}
