import express from 'express';
import cors from 'cors';
import { llmManager } from './providers/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get available providers and models
app.get('/api/providers', (req, res) => {
  res.json(llmManager.getStatus());
});

// Get all available models (across configured providers)
app.get('/api/models', (req, res) => {
  res.json({
    models: llmManager.getAvailableModels(),
    defaultProvider: llmManager.defaultProvider
  });
});

// Chat endpoint with provider/model selection
app.post('/api/chat', async (req, res) => {
  const { messages, systemPrompt, provider, model } = req.body;

  try {
    const result = await llmManager.chat({
      messages,
      systemPrompt,
      provider,
      model
    });

    res.json({
      content: [{ type: 'text', text: result.content }],
      model: result.model,
      provider: result.provider,
      usage: result.usage
    });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`MSP Assistant Server running on port ${PORT}`);
    console.log('');
    console.log('Provider Status:');
    const status = llmManager.getStatus();
    for (const [name, info] of Object.entries(status.providers)) {
      const icon = info.configured ? '✓' : '✗';
      console.log(`  ${icon} ${name}: ${info.configured ? 'configured' : 'not configured'}`);
    }
    console.log('');
    console.log(`Default provider: ${status.defaultProvider}`);
  });
}

export default app;
