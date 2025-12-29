# Deployment Guide for DigitalOcean Droplet

This guide will help you deploy the MentraFlow frontend to your existing DigitalOcean droplet where the backend is already running.

## Configuration

- **Droplet IP**: `147.182.239.22`
- **SSH User**: `mentraflow`
- **Backend Directory**: `/home/mentraflow/mentraflow-backend`
- **Frontend Directory**: `/home/mentraflow/mentraflow-frontend`

## Quick Start

**Standard workflow (recommended):**

1. **Push your code to git:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main  # or your branch name
   ```

2. **SSH to your droplet and update:**
   ```bash
   ssh mentraflow@147.182.239.22
   cd /home/mentraflow/mentraflow-frontend
   ./scripts/update.sh
   ```

   This will:
   - Pull latest changes from git
   - Update dependencies
   - Build production bundle
   - Deploy new build
   - Reload nginx

## Prerequisites

1. **DigitalOcean Droplet** with backend already running
2. **SSH access** to the droplet as `mentraflow` user
3. **Node.js 18+** installed on the droplet
4. **Nginx** installed and configured
5. **Google OAuth credentials** configured for production

## Step 1: Initial Server Setup

### 1.1 Connect to Your Droplet

```bash
ssh mentraflow@147.182.239.22
```

### 1.2 Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3 Install Node.js 18+

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v18.x.x or higher
npm -v
```

### 1.4 Install Nginx

```bash
sudo apt install -y nginx

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 1.5 Install Git (if not already installed)

```bash
sudo apt install -y git
```

## Step 2: Clone and Setup Project

### 2.1 Clone Repository

```bash
# Navigate to home directory
cd /home/mentraflow

# Clone your repository (replace with your repo URL)
git clone https://github.com/your-username/mentraflow-frontend.git
# OR if using SSH:
# git clone git@github.com:your-username/mentraflow-frontend.git

cd mentraflow-frontend
```

### 2.2 Configure Environment Variables

```bash
# Copy example environment file
cp env.production.example .env

# Edit with your production values
nano .env
```

Update the `.env` file with:
```env
REACT_APP_BACKEND_URL=http://147.182.239.22
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Important**: Make sure your Google OAuth Client ID has your production IP added to:
- **Authorized JavaScript origins**: `http://147.182.239.22`
- **Authorized redirect URIs**: `http://147.182.239.22`

## Step 3: Configure Nginx

### 3.1 Copy Nginx Configuration

```bash
# Copy nginx config to nginx sites-available
sudo cp nginx.conf /etc/nginx/sites-available/mentraflow-frontend

# Create symbolic link to enable the site (if not already exists)
sudo ln -sf /etc/nginx/sites-available/mentraflow-frontend /etc/nginx/sites-enabled/mentraflow-frontend

# If you have a default site, you may want to disable it
# sudo rm /etc/nginx/sites-enabled/default
```

**Note**: The nginx configuration is already set up to:
- Serve the frontend from `/home/mentraflow/mentraflow-frontend/build`
- Proxy API requests (`/api/*`) to the backend at `http://localhost:8000`
- Handle React Router SPA routing

### 3.3 Test and Reload Nginx

```bash
# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

## Step 4: Deploy the Application

### 4.1 Make Deployment Script Executable

```bash
chmod +x scripts/deploy.sh
```

### 4.2 Run Deployment Script

```bash
# Run the script (it will use sudo for nginx operations if needed)
./scripts/deploy.sh
```

**Or use the update script** (recommended - pulls latest changes first):
```bash
chmod +x scripts/update.sh
./scripts/update.sh
```

The script will:
1. Check Node.js installation
2. Install/update dependencies
3. Build the production bundle
4. Deploy new build to `/home/mentraflow/mentraflow-frontend/build`
5. Set proper permissions
6. Test and reload nginx

## Step 5: Configure Firewall (UFW)

```bash
# Allow SSH (if not already allowed)
sudo ufw allow OpenSSH

# Allow HTTP
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 6: Verify Deployment

1. **Check if app is accessible:**
   - Open browser: `http://147.182.239.22`
   - You should see the MentraFlow homepage
   - API calls should work (they're proxied to backend at `http://localhost:8000`)

2. **Check nginx status:**
   ```bash
   sudo systemctl status nginx
   ```

3. **Check nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

## Step 7: Setup SSL/HTTPS (Optional but Recommended)

### 7.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate

```bash
# Replace with your domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts to set up SSL.

### 7.3 Auto-renewal

Certbot sets up auto-renewal automatically. Test it:

```bash
sudo certbot renew --dry-run
```

## Updating the Deployment

When you need to update the application:

1. **Pull latest changes:**
   ```bash
   cd /home/mentraflow/mentraflow-frontend
   git pull origin main  # or your branch name
   ```

2. **Update environment variables if needed:**
   ```bash
   nano .env
   ```

3. **Run deployment script:**
   ```bash
   ./scripts/deploy.sh
   ```
   
   **Or use the update script** (recommended - pulls latest changes first):
   ```bash
   ./scripts/update.sh
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
- Verify environment variables are set correctly
- Check if build completed successfully
- Verify nginx is serving from correct directory

### Issue: API Calls Failing

**Solution:**
- Verify `REACT_APP_BACKEND_URL` in `.env` is correct
- Check backend CORS settings allow your frontend domain
- Check browser Network tab for CORS errors

### Issue: Google OAuth Not Working

**Solution:**
- Verify `REACT_APP_GOOGLE_CLIENT_ID` is set correctly
- Check Google Cloud Console has your production domain in:
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

## Rollback (If Needed)

If you need to rollback to a previous version:

1. **Checkout a previous commit:**
   ```bash
   cd /home/mentraflow/mentraflow-frontend
   git log  # Find the commit hash you want
   git checkout <commit-hash>
   ```

2. **Rebuild and deploy:**
   ```bash
   ./scripts/deploy.sh
   ```

3. **Or restore from git:**
   ```bash
   git checkout main  # or your branch
   git pull
   ./scripts/update.sh
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

## Performance Optimization

1. **Enable gzip compression** (already in nginx.conf)

2. **Set up CDN** for static assets (optional)

3. **Enable HTTP/2** in nginx (requires SSL)

4. **Monitor server resources:**
   ```bash
   htop
   # or
   free -h
   df -h
   ```

## Additional Resources

- [DigitalOcean Documentation](https://www.digitalocean.com/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

