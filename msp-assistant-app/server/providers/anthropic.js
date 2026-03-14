import { BaseLLMProvider } from './base.js';

export class AnthropicProvider extends BaseLLMProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'anthropic';
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com';
    this.models = [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'Best balance of speed and capability' },
      { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', description: 'Most capable, best for complex tasks' },
      { id: 'claude-haiku-3-5-20241022', name: 'Claude Haiku 3.5', description: 'Fastest, best for simple tasks' }
    ];
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async chat({ messages, systemPrompt, model, maxTokens = 4000 }) {
    if (!this.isConfigured()) {
      throw new Error('Anthropic API key not configured');
    }

    const selectedModel = model || this.models[0].id;
    let allContent = [];
    let conversationMessages = [...messages];
    let continueLoop = true;
    let iterations = 0;
    const maxIterations = 5;

    while (continueLoop && iterations < maxIterations) {
      iterations++;

      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: conversationMessages,
          tools: [
            {
              type: 'web_search_20250305',
              name: 'web_search'
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const toolUseBlocks = data.content.filter(block => block.type === 'tool_use');

      if (toolUseBlocks.length > 0 && data.stop_reason === 'tool_use') {
        conversationMessages.push({
          role: 'assistant',
          content: data.content
        });

        const toolResults = toolUseBlocks.map(tool => ({
          type: 'tool_result',
          tool_use_id: tool.id,
          content: 'Tool executed successfully'
        }));

        conversationMessages.push({
          role: 'user',
          content: toolResults
        });

        allContent.push(...data.content);
      } else {
        allContent.push(...data.content);
        continueLoop = false;
      }
    }

    // Extract text content
    let finalText = '';
    for (const block of allContent) {
      if (block.type === 'text') {
        finalText += block.text;
      } else if (block.type === 'tool_use' && block.name === 'web_search') {
        finalText += `\n\n*Searching: ${block.input?.query || 'web'}*\n`;
      } else if (block.type === 'web_search_tool_result') {
        if (block.content && Array.isArray(block.content)) {
          const searchResults = block.content
            .filter(r => r.type === 'web_search_result')
            .slice(0, 3)
            .map(r => `- [${r.title}](${r.url})`)
            .join('\n');
          if (searchResults) {
            finalText += `\n\n**Sources:**\n${searchResults}\n`;
          }
        }
      }
    }

    return {
      content: finalText.trim(),
      model: selectedModel,
      provider: this.name
    };
  }
}
