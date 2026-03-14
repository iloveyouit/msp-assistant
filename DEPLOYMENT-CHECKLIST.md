# MSP Assistant Pro - Deployment Checklist

## 📋 Pre-Deployment Checklist

### System Requirements
- [ ] Docker installed (version 20.10+)
- [ ] Docker Compose installed (version 2.0+)
- [ ] Port 3000 available (or alternative port configured)
- [ ] 2GB RAM minimum
- [ ] 2GB disk space available

### Network Requirements
- [ ] Internet connectivity for initial build
- [ ] Firewall rules configured (if exposing externally)
- [ ] DNS configured (if using custom domain)
- [ ] SSL certificate ready (for HTTPS - recommended)

---

## 🚀 Deployment Steps

### Step 1: Extract Application
```bash
tar -xzf msp-assistant-app.tar.gz
cd msp-assistant-app
```
- [ ] Files extracted successfully
- [ ] In project directory

### Step 2: Configuration (Optional)
- [ ] Reviewed `docker-compose.yml` for port settings
- [ ] Customized client names in `src/App.jsx` (line 70)
- [ ] Updated company branding in `src/App.jsx` (line 277-278)
- [ ] Configured environment variables (if needed)

### Step 3: Build and Deploy
```bash
./deploy.sh
```
OR manually:
```bash
docker-compose up -d --build
```
- [ ] Docker image built successfully
- [ ] Container started
- [ ] No error messages in logs

### Step 4: Verify Deployment
```bash
docker-compose ps
docker-compose logs -f
```
- [ ] Container shows "Up" status
- [ ] No errors in logs
- [ ] Health check passing

### Step 5: Test Application
- [ ] Open `http://localhost:3000` in browser
- [ ] Application loads correctly
- [ ] Quick actions work
- [ ] Can type in chat input
- [ ] Upload button visible
- [ ] Save/Export buttons functional

---

## 🔒 Security Hardening (Production)

### Essential Security Steps
- [ ] Change default port if exposing externally
- [ ] Implement HTTPS with SSL certificate
- [ ] Add firewall rules to restrict access
- [ ] Configure reverse proxy (Nginx/Traefik)
- [ ] Implement authentication (Azure AD recommended)
- [ ] Restrict CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts

### Recommended: Nginx Reverse Proxy with SSL

1. **Install Nginx:**
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```
- [ ] Nginx installed

2. **Configure proxy:**
```bash
sudo nano /etc/nginx/sites-available/msp-assistant
```

Add:
```nginx
server {
    listen 80;
    server_name msp.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
- [ ] Nginx config created

3. **Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/msp-assistant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
- [ ] Site enabled
- [ ] Nginx reloaded

4. **Get SSL certificate:**
```bash
sudo certbot --nginx -d msp.yourdomain.com
```
- [ ] SSL certificate obtained
- [ ] HTTPS working

---

## 🏢 Azure Deployment (Long View Systems)

### Option A: Azure VM Deployment

1. **Create Resource Group:**
```bash
az group create --name MSP-Assistant-RG --location canadacentral
```
- [ ] Resource group created

2. **Create VM:**
```bash
az vm create \
  --resource-group MSP-Assistant-RG \
  --name msp-assistant-vm \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard
```
- [ ] VM created
- [ ] SSH keys saved

3. **Open ports:**
```bash
az vm open-port --port 80 --resource-group MSP-Assistant-RG --name msp-assistant-vm --priority 1000
az vm open-port --port 443 --resource-group MSP-Assistant-RG --name msp-assistant-vm --priority 1001
```
- [ ] Ports opened

4. **SSH and deploy:**
```bash
ssh azureuser@<vm-ip>
sudo apt update && sudo apt install docker.io docker-compose -y
# Upload tar.gz and extract
# Run docker-compose up -d
```
- [ ] Connected via SSH
- [ ] Docker installed
- [ ] Application deployed

### Option B: Azure Container Instances

1. **Create ACR:**
```bash
az acr create --resource-group MSP-Assistant-RG --name mspacr143 --sku Basic
```
- [ ] ACR created

2. **Build and push:**
```bash
az acr build --registry mspacr143 --image msp-assistant:v1 .
```
- [ ] Image built and pushed

3. **Deploy to ACI:**
```bash
az container create \
  --resource-group MSP-Assistant-RG \
  --name msp-assistant \
  --image mspacr143.azurecr.io/msp-assistant:v1 \
  --dns-name-label msp-assistant-143 \
  --ports 80 \
  --cpu 1 \
  --memory 1
```
- [ ] Container instance created
- [ ] Public IP assigned

---

## 📊 Monitoring Setup

### Docker Monitoring
```bash
# Check container stats
docker stats msp-assistant-pro

# View logs
docker-compose logs -f --tail=100

# Check health
curl http://localhost:3000/health
```
- [ ] Monitoring commands work
- [ ] Health endpoint responds

### Optional: Prometheus + Grafana
- [ ] Prometheus configured
- [ ] Grafana dashboard created
- [ ] Alerts configured

---

## 🔄 Backup and Maintenance

### Backup Strategy
- [ ] LocalStorage data backed up (browser-based)
- [ ] Docker volumes identified
- [ ] Backup schedule created
- [ ] Restore procedure tested

### Update Procedure
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```
- [ ] Update procedure documented
- [ ] Rollback plan created

---

## ✅ Go-Live Checklist

### Before Go-Live
- [ ] All tests passing
- [ ] Security hardening complete
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team trained on usage

### Go-Live
- [ ] Application accessible to users
- [ ] Performance acceptable
- [ ] No errors in logs
- [ ] Health checks passing

### Post Go-Live
- [ ] Monitor for 24 hours
- [ ] Collect user feedback
- [ ] Address any issues
- [ ] Schedule regular reviews

---

## 📞 Support Contacts

**Technical Issues:**
- Rob Loftin - Long View Systems
- Email: rloftin@longviewsystems.com

**Deployment Issues:**
- Check logs: `docker-compose logs -f`
- GitHub Issues (if applicable)
- Internal IT support ticket

---

## 📝 Common Issues and Solutions

### Issue: Container won't start
**Solution:**
```bash
docker-compose logs
# Look for port conflicts or missing dependencies
```

### Issue: Port 3000 in use
**Solution:**
Edit `docker-compose.yml` and change port to 8080 or another available port

### Issue: Can't access from network
**Solution:**
```bash
# Check firewall
sudo ufw status
sudo ufw allow 3000/tcp

# Check Docker network
docker network inspect msp-network
```

### Issue: Slow performance
**Solution:**
- Increase Docker memory allocation
- Check system resources: `docker stats`
- Optimize image size

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Environment:** [ ] Development [ ] Staging [ ] Production  
**Version:** 1.0.0
