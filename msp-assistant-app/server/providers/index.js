import { AnthropicProvider } from './anthropic.js';
import { OpenAIProvider } from './openai.js';
import { GoogleProvider } from './google.js';
import { OllamaProvider } from './ollama.js';

/**
 * LLM Provider Manager
 * Handles multiple LLM providers and model selection
 */
export class LLMProviderManager {
  constructor() {
    this.providers = {
      anthropic: new AnthropicProvider(),
      openai: new OpenAIProvider(),
      google: new GoogleProvider(),
      ollama: new OllamaProvider()
    };

    this.defaultProvider = process.env.DEFAULT_LLM_PROVIDER || 'anthropic';
  }

  /**
   * Get a specific provider
   */
  getProvider(name) {
    return this.providers[name];
  }

  /**
   * Get all providers
   */
  getAllProviders() {
    return this.providers;
  }

  /**
   * Get status of all providers
   */
  getStatus() {
    const status = {};
    for (const [name, provider] of Object.entries(this.providers)) {
      status[name] = provider.getStatus();
    }
    return {
      providers: status,
      defaultProvider: this.defaultProvider
    };
  }

  /**
   * Get all available models across all configured providers
   */
  getAvailableModels() {
    const models = [];
    for (const [providerName, provider] of Object.entries(this.providers)) {
      if (provider.isConfigured()) {
        for (const model of provider.getModels()) {
          models.push({
            ...model,
            provider: providerName,
            fullId: `${providerName}/${model.id}`
          });
        }
      }
    }
    return models;
  }

  /**
   * Send a chat request to the appropriate provider
   * @param {Object} params
   * @param {string} params.provider - Provider name (optional, uses default)
   * @param {string} params.model - Model ID (optional, uses provider default)
   * @param {Array} params.messages - Chat messages
   * @param {string} params.systemPrompt - System prompt
   * @param {number} params.maxTokens - Max tokens
   */
  async chat({ provider, model, messages, systemPrompt, maxTokens = 4000 }) {
    // Parse provider/model from combined format (e.g., "openai/gpt-4o")
    if (model && model.includes('/')) {
      const [parsedProvider, parsedModel] = model.split('/');
      provider = parsedProvider;
      model = parsedModel;
    }

    const providerName = provider || this.defaultProvider;
    const selectedProvider = this.providers[providerName];

    if (!selectedProvider) {
      throw new Error(`Unknown provider: ${providerName}`);
    }

    if (!selectedProvider.isConfigured()) {
      throw new Error(`Provider ${providerName} is not configured. Check your API keys.`);
    }

    return selectedProvider.chat({
      messages,
      systemPrompt,
      model,
      maxTokens
    });
  }
}

// Singleton instance
export const llmManager = new LLMProviderManager();

// Export individual providers for direct use
export { AnthropicProvider, OpenAIProvider, GoogleProvider, OllamaProvider };
