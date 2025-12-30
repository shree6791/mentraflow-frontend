# Deployment Guide for DigitalOcean Droplet

This guide will help you deploy the MentraFlow frontend to your existing DigitalOcean droplet where the backend is already running.

## Configuration

- **Droplet IP**: `147.182.239.22`
- **Domain**: `getmentraflow.com`
- **SSH User**: `mentraflow`
- **Frontend Directory**: `/home/mentraflow/mentraflow-frontend`

## Prerequisites

1. **DigitalOcean Droplet** with backend already running
2. **SSH access** to the droplet as `mentraflow` user
3. **Node.js 20+** installed on the droplet (LTS recommended)
4. **Nginx** installed and configured
5. **Google OAuth credentials** configured for production

## Initial Server Setup

### 1. Connect to Your Droplet

```bash
ssh mentraflow@147.182.239.22
```

### 2. Install Node.js 20+ (LTS)

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v20.x.x or higher
npm -v   # Should show v10.x.x or higher

# Update npm to latest version
sudo npm install -g npm@latest
```

### 3. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 4. Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## Initial Deployment

### Step 1: Copy Code to Server (SCP)

**On your local machine:**

```bash
# Navigate to your project directory
cd /path/to/mentraflow-frontend

# Copy files using rsync (recommended - faster and supports exclusions)
rsync -avz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='.env' \
  ./ mentraflow@147.182.239.22:/home/mentraflow/mentraflow-frontend/
```

**Alternative: Using tar + SCP (if rsync is not available):**

```bash
# Create a tarball excluding unnecessary files
tar --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='.env' \
    -czf mentraflow-frontend.tar.gz .

# Copy to server
scp mentraflow-frontend.tar.gz mentraflow@147.182.239.22:/tmp/

# On server, extract it
ssh mentraflow@147.182.239.22
cd /home/mentraflow
mkdir -p mentraflow-frontend
cd mentraflow-frontend
tar -xzf /tmp/mentraflow-frontend.tar.gz
rm /tmp/mentraflow-frontend.tar.gz
```

### Step 2: Configure Environment Variables

**On the server:**

```bash
cd /home/mentraflow/mentraflow-frontend
cp env.production.example .env
nano .env
```

Update the `.env` file with:
```env
# Use https:// once SSL is configured, http:// for initial setup
VITE_BACKEND_URL=https://getmentraflow.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Important**: For Google OAuth, configure your domain `getmentraflow.com`:
- **Authorized JavaScript origins**: 
  - `http://localhost:3000` (for development)
  - `https://getmentraflow.com` (for production - after SSL setup)
  - `http://getmentraflow.com` (temporary, until SSL is configured)
- **Authorized redirect URIs**: Same as above
- ⚠️ **IP addresses like `http://147.182.239.22` will NOT work** - Google requires a valid domain

### Step 3: Configure Nginx

```bash
# Copy nginx config to nginx sites-available
sudo cp nginx.conf /etc/nginx/sites-available/mentraflow-frontend

# Create symbolic link to enable the site
sudo ln -sf /etc/nginx/sites-available/mentraflow-frontend /etc/nginx/sites-enabled/mentraflow-frontend

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

**Note**: The nginx configuration serves the frontend from `/home/mentraflow/mentraflow-frontend/build` and proxies API requests (`/api/*`) to the backend at `http://localhost:8000`.

### Step 4: Set Up SSL (HTTPS) with Let's Encrypt

Once your domain DNS has propagated (test with `ping getmentraflow.com`), set up SSL:

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate (replace with your email)
sudo certbot --nginx -d getmentraflow.com -d www.getmentraflow.com --email your-email@example.com --agree-tos --non-interactive

# Certbot will automatically configure nginx for HTTPS
# It will also set up automatic renewal

# Test the renewal process
sudo certbot renew --dry-run
```

After SSL is set up:
1. **Update your `.env` file** on the server: `VITE_BACKEND_URL=https://getmentraflow.com`
2. **Update Google Cloud Console** to use `https://getmentraflow.com` (you can keep `http://` for now too)
3. **Rebuild and redeploy** the frontend

### Step 5: Deploy the Application

```bash
cd /home/mentraflow/mentraflow-frontend

# Make deployment scripts executable
chmod +x scripts/deploy.sh
chmod +x scripts/update.sh

# Run the initial deployment script
./scripts/deploy.sh
```

The script will:
1. Check Node.js installation
2. Install/update dependencies
3. Build the production bundle (outputs to `dist/`)
4. Copy `dist/` to `build/` for nginx
5. Set proper permissions
6. Test and reload nginx

### Step 5: Verify Deployment

1. **Check if app is accessible:**
   - Open browser: `http://147.182.239.22`
   - You should see the MentraFlow homepage

2. **Check nginx status:**
   ```bash
   sudo systemctl status nginx
   ```

3. **Check logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

## Updating the Deployment

When you need to update the application:

### Step 1: Copy Updated Code to Server

**On your local machine:**

```bash
cd /path/to/mentraflow-frontend

# Copy updated files using rsync
rsync -avz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='.env' \
  ./ mentraflow@147.182.239.22:/home/mentraflow/mentraflow-frontend/
```

### Step 2: Run Update Script

**On the server:**

```bash
ssh mentraflow@147.182.239.22
cd /home/mentraflow/mentraflow-frontend
./scripts/update.sh
```

The script will:
- Update dependencies
- Build production bundle
- Deploy new build
- Reload nginx

**Note**: The update script does not pull from git. It assumes you've already copied the updated code using SCP.

## SSL/HTTPS Setup (Optional but Recommended)

### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain SSL Certificate

```bash
# Replace with your domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Test Auto-renewal

```bash
sudo certbot renew --dry-run
```

## Troubleshooting

### Issue: 502 Bad Gateway

**Solution:**
- Check if nginx is running: `sudo systemctl status nginx`
- Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify build directory exists: `ls -la /home/mentraflow/mentraflow-frontend/build`

### Issue: Blank Page

**Solution:**
- Check browser console for errors
- Verify environment variables are set correctly: `cat .env`
- Check if build completed successfully: `ls -la dist/`
- Verify nginx is serving from correct directory

### Issue: API Calls Failing

**Solution:**
- Verify `VITE_BACKEND_URL` in `.env` is correct
- Check backend CORS settings allow your frontend domain
- Check browser Network tab for CORS errors

### Issue: Google OAuth Not Working

**Solution:**
- Verify `VITE_GOOGLE_CLIENT_ID` is set correctly
- Check Google Cloud Console has your production IP in:
  - Authorized JavaScript origins
  - Authorized redirect URIs
- Clear browser cache and try again

### View Logs

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## Security Recommendations

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use SSH keys instead of passwords**

3. **Configure fail2ban for SSH protection:**
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   ```

4. **Monitor logs** regularly for suspicious activity

## Additional Resources

- [DigitalOcean Documentation](https://www.digitalocean.com/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
