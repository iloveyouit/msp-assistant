# MSP Operations Assistant Pro

AI-powered troubleshooting and automation platform for MSP operations. Built with React, Tailwind CSS, and Claude AI API.

![MSP Assistant](https://img.shields.io/badge/Status-Production%20Ready-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- 🤖 **AI-Powered Troubleshooting** - Azure VM, Entra ID, Windows Server diagnostics
- 💻 **PowerShell Automation** - Generate production-ready scripts on demand
- 📊 **Log Analysis** - Upload and analyze Event Logs, IIS logs, application logs
- 📝 **Notion Integration** - Auto-log incidents to your Notion workspace
- 🔍 **Web Search** - Access current Microsoft KB articles and documentation
- 💾 **Conversation History** - Save and reload troubleshooting sessions
- 📥 **Export Options** - Export conversations as Markdown or DOCX
- 🎯 **Quick Actions** - Pre-built templates for common MSP tasks

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Claude Sonnet 4 API
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (production)

## Prerequisites

- Docker & Docker Compose (recommended)
- OR Node.js 18+ and npm (for local development)

## Quick Start with Docker (Recommended)

### 1. Clone or Download

Save all files to a directory called `msp-assistant-app`

### 2. Build and Run

```bash
cd msp-assistant-app

# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Access the Application

Open your browser to: **http://localhost:3000**

### 4. Stop the Application

```bash
docker-compose down
```

## Local Development (Without Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Application runs on: **http://localhost:3000**

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Docker Commands

### Build Image
```bash
docker build -t msp-assistant-pro .
```

### Run Container
```bash
docker run -d -p 3000:80 --name msp-assistant msp-assistant-pro
```

### Stop Container
```bash
docker stop msp-assistant
docker rm msp-assistant
```

### View Logs
```bash
docker logs -f msp-assistant
```

### Rebuild After Changes
```bash
docker-compose down
docker-compose up -d --build
```

## Configuration

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.anthropic.com
VITE_APP_VERSION=1.0.0
```

### Customization

**Client Names**: Edit `src/App.jsx` line 68-70 to add your MSP clients:

```javascript
Available clients: Your Client 1, Your Client 2, Your Client 3.
```

**Quick Actions**: Modify `src/App.jsx` line 211-216 to customize buttons

**System Prompt**: Update `src/App.jsx` line 51-70 for different specialties

## Deployment Options

### Option 1: Docker on Local Server

```bash
# Clone the project
git clone <your-repo> msp-assistant-app
cd msp-assistant-app

# Start with Docker Compose
docker-compose up -d

# Access at http://your-server-ip:3000
```

### Option 2: Azure Container Instances

```bash
# Build and push to Azure Container Registry
az acr build --registry <your-acr> --image msp-assistant:v1 .

# Deploy to Azure Container Instance
az container create \
  --resource-group <your-rg> \
  --name msp-assistant \
  --image <your-acr>.azurecr.io/msp-assistant:v1 \
  --dns-name-label msp-assistant \
  --ports 80
```

### Option 3: Production VM (Ubuntu/Debian)

```bash
# Install Docker
sudo apt update
sudo apt install docker.io docker-compose -y

# Clone and deploy
cd /opt
sudo git clone <your-repo> msp-assistant-app
cd msp-assistant-app
sudo docker-compose up -d

# Setup reverse proxy (Nginx)
sudo apt install nginx -y
# Configure nginx to proxy to localhost:3000
```

### Option 4: Azure Web App for Containers

```bash
# Create App Service Plan
az appservice plan create \
  --name msp-assistant-plan \
  --resource-group <your-rg> \
  --is-linux

# Create Web App
az webapp create \
  --resource-group <your-rg> \
  --plan msp-assistant-plan \
  --name msp-assistant-webapp \
  --deployment-container-image-name <your-acr>.azurecr.io/msp-assistant:v1
```

## Project Structure

```
msp-assistant-app/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
├── Dockerfile               # Docker build configuration
├── docker-compose.yml       # Docker Compose orchestration
├── nginx.conf               # Nginx configuration
├── vite.config.js           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json             # Node.js dependencies
└── README.md                # This file
```

## Usage Guide

### 1. Quick Actions
Click any quick action button to start a pre-configured workflow:
- **Azure VM Issue** - Troubleshoot VM problems
- **PowerShell Script** - Generate automation scripts
- **Incident Report** - Create documentation
- **AD Password Reset** - User account troubleshooting

### 2. Upload Log Files
- Click **Upload** button
- Select `.log`, `.txt`, `.csv`, or `.evtx` files
- AI automatically analyzes and identifies issues

### 3. Save Conversations
- Click **Save** after important troubleshooting sessions
- Name your conversation (e.g., "GR Energy SQL Fix")
- Reload from **History** panel anytime

### 4. Export Documentation
- Click **Export** → **Markdown**
- Downloads timestamped conversation file
- Use for client reports or knowledge base

### 5. Notion Integration
After resolving incidents, tell the assistant:
- "Log this incident to Notion for McLeod"
- "Create Notion entry for this SQL outage"

## Troubleshooting

### Port 3000 Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "8080:80"  # Change 3000 to 8080
```

### Container Won't Start
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Can't Access from Other Machines
```bash
# Ensure firewall allows port 3000
sudo ufw allow 3000/tcp

# Or use nginx reverse proxy
```

## Performance Optimization

### Production Build Optimizations
- Minified JavaScript bundles
- Tree-shaking unused code
- Gzip compression enabled
- Static asset caching (1 year)
- Code splitting for vendor libraries

### Docker Image Size
- Multi-stage build: ~50MB final image
- Alpine Linux base images
- Production dependencies only

## Security Considerations

- ⚠️ **API Key**: Claude API calls are made client-side. Do NOT expose API keys in production.
- ✅ **Recommendation**: Add a backend proxy server to handle API calls securely
- ✅ **HTTPS**: Use reverse proxy (Nginx/Traefik) with SSL certificates
- ✅ **Firewall**: Restrict access to port 3000 or use VPN

## Future Enhancements

- [ ] Backend API proxy for secure Claude API calls
- [ ] PostgreSQL database for persistent conversation storage
- [ ] Multi-user authentication (Azure AD integration)
- [ ] Real-time collaboration features
- [ ] Advanced log parsing with regex patterns
- [ ] Integration with ConnectWise/Autotask PSA tools
- [ ] Mobile-responsive design improvements

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

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Built for**: Long View Systems MSP Operations Team
