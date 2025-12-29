# Frontend Not Showing - Troubleshooting Guide

If you're seeing the API response `{"message":"MentraFlow API","version":"0.1.0"}` instead of the frontend UI, follow these steps:

## Quick Diagnosis

**SSH to your server and run these commands:**

```bash
ssh mentraflow@147.182.239.22
```

### Step 1: Check if Frontend Build Exists

```bash
ls -la /home/mentraflow/mentraflow-frontend/build
```

**Expected:** You should see `index.html` and other files.

**If missing:** The frontend hasn't been built/deployed yet.

### Step 2: Check Nginx Status

```bash
sudo systemctl status nginx
```

**Expected:** Should show "active (running)".

**If not running:**
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 3: Check Nginx Configuration

```bash
# Check if nginx config exists
ls -la /etc/nginx/sites-enabled/mentraflow-frontend

# Test nginx configuration
sudo nginx -t
```

**If config is missing or test fails:** Follow the deployment steps to configure nginx.

### Step 4: Check What Nginx is Serving

```bash
# Check nginx error logs
sudo tail -20 /var/log/nginx/error.log

# Check nginx access logs
sudo tail -20 /var/log/nginx/access.log
```

## Solution: Deploy the Frontend

If the build directory doesn't exist, you need to deploy the frontend:

### Option 1: Use Deployment Script (Recommended)

```bash
cd /home/mentraflow/mentraflow-frontend

# Make sure scripts are executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

### Option 2: Manual Deployment

```bash
cd /home/mentraflow/mentraflow-frontend

# Install dependencies
npm ci

# Build the frontend
npm run build

# Copy dist to build (nginx serves from build directory)
rm -rf build
cp -r dist build

# Set permissions
chmod -R 755 build
```

### Configure Nginx (if not done)

```bash
cd /home/mentraflow/mentraflow-frontend

# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/mentraflow-frontend

# Enable the site
sudo ln -sf /etc/nginx/sites-available/mentraflow-frontend /etc/nginx/sites-enabled/mentraflow-frontend

# Remove default site (if it exists)
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

## Verify It's Working

After deployment:

1. **Check build directory:**
   ```bash
   ls -la /home/mentraflow/mentraflow-frontend/build/index.html
   ```

2. **Check nginx is serving it:**
   ```bash
   curl http://localhost
   ```
   Should return HTML, not JSON.

3. **Access in browser:**
   - Go to `http://147.182.239.22`
   - You should see the MentraFlow homepage, not the API response

## Common Issues

### Issue: "502 Bad Gateway"
- **Cause:** Nginx can't find the build directory
- **Fix:** Ensure `build/` directory exists and has `index.html`

### Issue: Still seeing API response
- **Cause:** Nginx not configured or default site is active
- **Fix:** Remove default nginx site and ensure mentraflow-frontend config is active

### Issue: "403 Forbidden"
- **Cause:** Permissions issue
- **Fix:** `chmod -R 755 /home/mentraflow/mentraflow-frontend/build`

