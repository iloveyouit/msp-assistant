# MSP Operations Assistant Pro

AI-powered troubleshooting and automation platform for MSP operations. Built with React, Tailwind CSS, and multi-LLM support.

![MSP Assistant](https://img.shields.io/badge/Status-Production%20Ready-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- **AI-Powered Troubleshooting** - Azure VM, Entra ID, Windows Server diagnostics
- **Multi-LLM Support** - Anthropic Claude, OpenAI GPT-4, Google Gemini, Ollama (local)
- **PowerShell Automation** - Generate production-ready scripts on demand
- **Log Analysis** - Upload and analyze Event Logs, IIS logs, application logs
- **Conversation History** - Save and reload troubleshooting sessions
- **Export Options** - Export conversations as Markdown
- **Quick Actions** - Pre-built templates for common MSP tasks
- **Secure API Proxy** - Backend server keeps API keys safe

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶│    LLM APIs     │
│   (React/Vite)  │     │    (Express)    │     │ Claude/GPT/etc  │
│    Port 3009    │     │    Port 3010    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Claude, GPT-4, Gemini, Ollama
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (production)

## Prerequisites

- Docker & Docker Compose (recommended)
- OR Node.js 18+ and npm (for local development)
- At least one LLM API key (Anthropic, OpenAI, or Google)

## Quick Start with Docker (Recommended)

### 1. Configure Environment

```bash
cd msp-assistant-app

# Copy example env and add your API keys
cp .env.example .env
# Edit .env and set your API keys
```

### 2. Build and Run

```bash
# Build and start both frontend and backend containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Access the Application

Open your browser to: **http://localhost:3009**

### 4. Stop the Application

```bash
docker-compose down
```

## Local Development (Without Docker)

### 1. Start Backend Server

```bash
cd server
npm install

# Set your API keys
export ANTHROPIC_API_KEY=your-key-here
export OPENAI_API_KEY=your-key-here  # optional
export PORT=3010

npm start
```

Backend runs on: **http://localhost:3010**

### 2. Start Frontend (New Terminal)

```bash
npm install
npm run dev
```

Frontend runs on: **http://localhost:3009**

## Project Structure

```
msp-assistant-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # App header with actions
│   │   ├── MessageList.jsx    # Chat message display
│   │   ├── Message.jsx        # Individual message
│   │   ├── ChatInput.jsx      # Input field
│   │   ├── QuickActions.jsx   # Quick action buttons
│   │   ├── SaveDialog.jsx     # Save conversation modal
│   │   ├── HistorySidebar.jsx # Conversation history
│   │   ├── ModelSelector.jsx  # LLM model dropdown
│   │   └── index.js           # Component exports
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── server/
│   ├── providers/             # LLM provider implementations
│   │   ├── anthropic.js       # Claude API
│   │   ├── openai.js          # GPT-4 API
│   │   ├── google.js          # Gemini API
│   │   ├── ollama.js          # Local models
│   │   └── index.js           # Provider manager
│   ├── index.js               # Express API server
│   └── package.json           # Server dependencies
├── public/                    # Static assets
├── Dockerfile                 # Frontend Docker config
├── Dockerfile.server          # Backend Docker config
├── docker-compose.yml         # Multi-container orchestration
├── nginx.conf                 # Nginx configuration
├── vite.config.js             # Vite build configuration
├── tailwind.config.js         # Tailwind CSS config
├── package.json               # Frontend dependencies
├── .env.example               # Environment template
└── README.md                  # This file
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# LLM Provider API Keys (configure the ones you want to use)
ANTHROPIC_API_KEY=your-anthropic-key-here
OPENAI_API_KEY=your-openai-key-here
GOOGLE_API_KEY=your-google-key-here

# Default provider (anthropic, openai, google, or ollama)
DEFAULT_LLM_PROVIDER=anthropic

# Server Configuration
PORT=3010

# Frontend Configuration
VITE_API_URL=http://localhost:3010
```

### Supported LLM Providers

| Provider | Models | API Key Required |
|----------|--------|------------------|
| **Anthropic** | Claude Sonnet 4, Opus 4, Haiku 3.5 | Yes |
| **OpenAI** | GPT-4o, GPT-4 Turbo, GPT-3.5 | Yes |
| **Google** | Gemini 1.5 Pro, Gemini 1.5 Flash | Yes |
| **Ollama** | Llama 3.1, Mistral, CodeLlama, etc. | No (local) |

### Customization

**Client Names**: Edit `src/App.jsx` SYSTEM_PROMPT to add your MSP clients

**Quick Actions**: Modify `src/components/QuickActions.jsx` to customize buttons

**System Prompt**: Update `src/App.jsx` SYSTEM_PROMPT for different specialties

## Usage Guide

### 1. Select a Model
Use the model selector dropdown in the header to choose your LLM provider and model.

### 2. New Chat
Click the **New Chat** button to start a fresh conversation.

### 3. Quick Actions
Click any quick action button to start a pre-configured workflow:
- **Azure VM Issue** - Troubleshoot VM problems
- **PowerShell Script** - Generate automation scripts
- **Incident Report** - Create documentation
- **AD Password Reset** - User account troubleshooting

### 4. Upload Log Files
- Click **Upload** button
- Select `.log`, `.txt`, `.csv`, or `.evtx` files
- AI automatically analyzes and identifies issues

### 5. Save Conversations
- Click **Save** after important troubleshooting sessions
- Name your conversation (e.g., "GR Energy SQL Fix")
- Reload from **History** panel anytime
- Delete with confirmation prompt

### 6. Export Documentation
- Click **Export** → **Markdown**
- Downloads timestamped conversation file
- Use for client reports or knowledge base

## Docker Commands

### Build Images
```bash
docker-compose build
```

### Run Containers
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
docker-compose logs backend   # Backend only
docker-compose logs frontend  # Frontend only
```

### Rebuild After Changes
```bash
docker-compose down
docker-compose up -d --build
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/providers` | GET | List all providers and their status |
| `/api/models` | GET | List available models |
| `/api/chat` | POST | Send chat message |
| `/health` | GET | Health check |

## Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml or .env
# Default: Frontend 3009, Backend 3010
```

### Container Won't Start
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### API Key Issues
```bash
# Verify keys are set
docker-compose exec backend env | grep API_KEY

# Check backend logs
docker-compose logs backend
```

### Backend Connection Failed
- Ensure backend container is running: `docker-compose ps`
- Check if port 3010 is accessible
- Verify VITE_API_URL is set correctly

## Security Features

- **Secure API Proxy** - API keys stored server-side, never exposed to browser
- **Input Validation** - File size limits and type checking
- **CORS Protection** - Configured for same-origin requests
- **No Sensitive Data in Client** - All API communication through backend

### Recommended for Production
- Use HTTPS with SSL certificates (nginx + certbot)
- Set up firewall rules
- Consider Azure AD authentication
- Use environment-specific API keys

## License

MIT License - Feel free to modify and distribute

## Support

For issues, questions, or feature requests, contact:
- **Rob Loftin** - Long View Systems (143IT)
- Email: rloftin@longviewsystems.com

## Acknowledgments

- Built with [Claude AI](https://www.anthropic.com/claude) by Anthropic
- UI components from [Lucide Icons](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Version**: 2.0.0
**Last Updated**: March 2026
**Built for**: Long View Systems MSP Operations Team
