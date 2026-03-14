import { BaseLLMProvider } from './base.js';

export class OllamaProvider extends BaseLLMProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'ollama';
    this.baseUrl = config.baseUrl || process.env.OLLAMA_URL || 'http://localhost:11434';
    this.models = [
      { id: 'llama3.1', name: 'Llama 3.1', description: 'Meta Llama 3.1 (8B)' },
      { id: 'llama3.1:70b', name: 'Llama 3.1 70B', description: 'Meta Llama 3.1 (70B)' },
      { id: 'mistral', name: 'Mistral', description: 'Mistral 7B' },
      { id: 'mixtral', name: 'Mixtral', description: 'Mixtral 8x7B MoE' },
      { id: 'codellama', name: 'Code Llama', description: 'Code-specialized Llama' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', description: 'Code generation model' }
    ];
  }

  isConfigured() {
    // Ollama doesn't need an API key, just needs to be running
    return true;
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getAvailableModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        return data.models?.map(m => ({
          id: m.name,
          name: m.name,
          description: `${(m.size / 1e9).toFixed(1)}GB`
        })) || [];
      }
    } catch {
      // Fallback to default models list
    }
    return this.models;
  }

  async chat({ messages, systemPrompt, model, maxTokens = 4000 }) {
    const selectedModel = model || 'llama3.1';

    // Convert messages to Ollama format
    const ollamaMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
      }))
    ];

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: ollamaMessages,
          stream: false,
          options: {
            num_predict: maxTokens
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.message?.content || '';

      return {
        content: content.trim(),
        model: selectedModel,
        provider: this.name,
        usage: {
          prompt_tokens: data.prompt_eval_count,
          completion_tokens: data.eval_count
        }
      };
    } catch (error) {
      if (error.cause?.code === 'ECONNREFUSED') {
        throw new Error('Ollama is not running. Start it with: ollama serve');
      }
      throw error;
    }
  }
}
