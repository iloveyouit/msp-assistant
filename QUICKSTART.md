# MSP Assistant Pro - Quick Start Guide

## 📦 What You Downloaded

You have the complete, production-ready MSP Operations Assistant web application. This is a Docker-containerized React app that you can deploy on any system with Docker installed.

## 🎯 Deployment Options

### Option 1: Docker (Recommended - Easiest)

**Requirements:**
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- 2GB RAM
- Port 3000 available

**Steps:**

1. **Extract the archive:**
   ```bash
   tar -xzf msp-assistant-app.tar.gz
   cd msp-assistant-app
   ```

2. **Deploy with one command:**
   ```bash
   ./deploy.sh
   ```
   
   Or manually:
   ```bash
   docker-compose up -d
   ```

3. **Access the app:**
   Open browser: `http://localhost:3000`

4. **Done!** 🎉

---

### Option 2: Local Development (No Docker)

**Requirements:**
- Node.js 18+
- npm

**Steps:**

1. **Extract and install:**
   ```bash
   tar -xzf msp-assistant-app.tar.gz
   cd msp-assistant-app
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Access the app:**
   Open browser: `http://localhost:3000`

---

### Option 3: Azure VM Deployment

**For your Long View Systems infrastructure:**

1. **Create Ubuntu VM in Azure:**
   ```bash
   az vm create \
     --resource-group MSP-Tools-RG \
     --name msp-assistant-vm \
     --image Ubuntu2204 \
     --size Standard_B2s \
     --admin-username azureuser \
     --generate-ssh-keys
   ```

2. **Open port 3000:**
   ```bash
   az vm open-port --port 3000 --resource-group MSP-Tools-RG --name msp-assistant-vm
   ```

3. **SSH into VM and deploy:**
   ```bash
   ssh azureuser@<vm-public-ip>
   
   # Install Docker
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker $USER
   
   # Upload your tar.gz file (using scp from local machine)
   # scp msp-assistant-app.tar.gz azureuser@<vm-ip>:~/
   
   # Extract and deploy
   tar -xzf msp-assistant-app.tar.gz
   cd msp-assistant-app
   sudo docker-compose up -d
   ```

4. **Access:** `http://<vm-public-ip>:3000`

---

### Option 4: Windows Server (Your McLeod/GR Energy Environment)

**Using Docker Desktop for Windows:**

1. **Install Docker Desktop:**
   - Download from docker.com
   - Requires Windows Server 2019+ or Windows 10 Pro

2. **Extract the archive:**
   - Right-click → Extract All
   - Or use PowerShell:
     ```powershell
     tar -xzf msp-assistant-app.tar.gz
     cd msp-assistant-app
     ```

3. **Deploy:**
   ```powershell
   docker-compose up -d
   ```

4. **Access:** `http://localhost:3000`

---

## 🔧 Configuration

### Change Port (if 3000 is in use)

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change 3000 to 8080 or any available port
```

### Customize for Your Clients

Edit `src/App.jsx` line 70:
```javascript
Available clients: GR Energy, McLeod, Deer Park, Canes Midstream, Lab Central.
```

Replace with your actual client names.

### Add Your Company Branding

Edit `src/App.jsx` line 277-278:
```javascript
<h1 className="text-xl font-bold">MSP Operations Assistant Pro</h1>
<p className="text-sm text-slate-400">Long View Systems (143IT)</p>
```

---

## 📊 System Requirements

### Minimum:
- **CPU:** 1 core
- **RAM:** 1GB
- **Disk:** 500MB
- **OS:** Any OS with Docker support

### Recommended:
- **CPU:** 2 cores
- **RAM:** 2GB
- **Disk:** 2GB
- **OS:** Ubuntu 22.04, Windows Server 2019+, macOS

---

## 🚀 First Time Setup

1. **Start the application**
2. **Open** `http://localhost:3000`
3. **Test Quick Actions:**
   - Click "Azure VM Issue"
   - Ask: "Help me troubleshoot an Azure VM"
4. **Upload a log file** (any .log or .txt file)
5. **Save your conversation** using the Save button
6. **Export** as Markdown to test

---

## 🛠️ Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs -f

# Rebuild
docker-compose down
docker-compose up -d --build
```

### Port already in use
```bash
# Find what's using port 3000
# Linux/Mac:
sudo lsof -i :3000

# Windows:
netstat -ano | findstr :3000

# Then change port in docker-compose.yml
```

### Can't access from other computers
```bash
# Linux: Open firewall
sudo ufw allow 3000/tcp

# Windows: Add firewall rule
New-NetFirewallRule -DisplayName "MSP Assistant" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

## 📝 Common Commands

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild after code changes
docker-compose up -d --build

# Check status
docker-compose ps

# Access container shell
docker-compose exec msp-assistant sh
```

---

## 🔐 Security Notes

⚠️ **IMPORTANT:** The Claude API calls are made client-side. For production:

1. **Add authentication** (Azure AD integration)
2. **Use HTTPS** with reverse proxy (Nginx + Let's Encrypt)
3. **Implement backend API proxy** to hide API keys
4. **Restrict network access** via firewall or VPN

**Quick Nginx Reverse Proxy Setup:**

```nginx
# /etc/nginx/sites-available/msp-assistant
server {
    listen 80;
    server_name msp.longviewsystems.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📞 Support

**Rob Loftin**  
Senior IT Infrastructure Consultant  
Long View Systems (143IT)  
Calgary, AB

---

## 🎯 Next Steps

1. ✅ Deploy to local machine (test)
2. ✅ Deploy to internal server (staging)
3. ✅ Configure SSL/HTTPS
4. ✅ Add Azure AD authentication
5. ✅ Share with team
6. ✅ Collect feedback
7. ✅ Iterate and improve

---

**Version:** 1.0.0  
**Build Date:** March 14, 2026  
**Built with:** React + Vite + Tailwind + Claude AI
