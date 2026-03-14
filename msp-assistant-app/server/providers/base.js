/**
 * Base LLM Provider class
 * All providers must implement these methods
 */
export class BaseLLMProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = 'base';
    this.models = [];
  }

  /**
   * Get available models for this provider
   * @returns {Array<{id: string, name: string, description: string}>}
   */
  getModels() {
    return this.models;
  }

  /**
   * Send a chat completion request
   * @param {Object} params
   * @param {Array} params.messages - Array of {role, content} messages
   * @param {string} params.systemPrompt - System prompt
   * @param {string} params.model - Model ID to use
   * @param {number} params.maxTokens - Max tokens to generate
   * @returns {Promise<{content: string, model: string, usage?: Object}>}
   */
  async chat(params) {
    throw new Error('chat() must be implemented by provider');
  }

  /**
   * Check if the provider is configured and ready
   * @returns {boolean}
   */
  isConfigured() {
    return false;
  }

  /**
   * Get provider status
   * @returns {Object}
   */
  getStatus() {
    return {
      name: this.name,
      configured: this.isConfigured(),
      models: this.getModels()
    };
  }
}
