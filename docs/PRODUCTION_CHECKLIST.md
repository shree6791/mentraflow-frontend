# Production Deployment Checklist

Use this checklist to ensure your production deployment is optimized and secure.

## ✅ Completed

- [x] Domain DNS configured (`getmentraflow.com` → `147.182.239.22`)
- [x] SSL/HTTPS set up with Let's Encrypt
- [x] Nginx configured for HTTPS
- [x] Backend API accessible via HTTPS
- [x] Firewall configured (ports 80, 443 open)
- [x] Health check endpoint working

## 🔧 Required Updates

### 1. Update Frontend Environment Variables

**On your server:**
```bash
cd /home/mentraflow/mentraflow-frontend
nano .env
```

**Update to:**
```env
VITE_BACKEND_URL=https://getmentraflow.com
VITE_GOOGLE_CLIENT_ID=470321149192-291eh18146u9viph0637t0ke4qe8c0na.apps.googleusercontent.com
```

**Then rebuild:**
```bash
./scripts/update.sh
```

### 2. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Edit your OAuth 2.0 Client ID
4. **Update Authorized JavaScript origins:**
   - `http://localhost:3000` (keep for local dev)
   - `https://getmentraflow.com` (add this)
   - Remove `http://getmentraflow.com` (no longer needed)
5. **Update Authorized redirect URIs:**
   - `http://localhost:3000` (keep for local dev)
   - `https://getmentraflow.com` (add this)
   - Remove `http://getmentraflow.com` (no longer needed)
6. **Save**

### 3. Apply Nginx Optimizations

Copy the updated `nginx.conf` with SSL optimizations:

```bash
# On your server
cd /home/mentraflow/mentraflow-frontend
sudo cp nginx.conf /etc/nginx/sites-available/mentraflow-frontend
sudo nginx -t
sudo systemctl reload nginx
```

## 🚀 Performance Optimizations

### 1. Enable HTTP/2 (Already Done)
- ✅ HTTP/2 is enabled in nginx config (`listen 443 ssl http2`)

### 2. Gzip Compression (Already Done)
- ✅ Gzip is enabled for text files

### 3. Static File Caching (Already Done)
- ✅ Static files have 1-year cache headers

### 4. SSL/TLS Optimizations (In Updated Config)
- ✅ OCSP stapling enabled
- ✅ Modern cipher suites
- ✅ TLS 1.2 and 1.3 only

## 🔒 Security Optimizations

### 1. Security Headers (Already Done)
- ✅ HSTS (Strict-Transport-Security)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ X-XSS-Protection

### 2. Rate Limiting (Optional - Add if needed)

If you want to add rate limiting for API endpoints, add to nginx config:

```nginx
# Add before server blocks
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# Inside /api location
limit_req zone=api_limit burst=20 nodelay;
```

### 3. Hide Nginx Version (Optional)

Add to nginx.conf:
```nginx
server_tokens off;
```

## 📊 Monitoring & Logging

### 1. Check Logs Regularly

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Backend logs
sudo journalctl -u mentraflow-api -f
```

### 2. Set Up Log Rotation (Already Configured)

Nginx log rotation is usually handled by `logrotate`. Verify:

```bash
cat /etc/logrotate.d/nginx
```

### 3. Monitor Certificate Expiry

Certbot auto-renews, but check status:

```bash
sudo certbot certificates
```

## 🧪 Testing Checklist

### 1. Test HTTPS
- [ ] Visit `https://getmentraflow.com` - should show lock icon
- [ ] HTTP should redirect to HTTPS
- [ ] Test all pages load correctly

### 2. Test API Endpoints
- [ ] `https://getmentraflow.com/api/v1/health` - should return healthy
- [ ] Test login/signup endpoints
- [ ] Test authenticated endpoints

### 3. Test Google OAuth
- [ ] Click "Sign in with Google" button
- [ ] Complete OAuth flow
- [ ] Verify redirect works correctly

### 4. Test Frontend Features
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] API calls work

## 🔄 Maintenance

### 1. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies (on server)
cd /home/mentraflow/mentraflow-frontend
npm update

# Rebuild and redeploy
./scripts/update.sh
```

### 2. Certificate Renewal

Certbot auto-renews, but verify:

```bash
# Test renewal
sudo certbot renew --dry-run

# Check renewal status
sudo systemctl status certbot.timer
```

### 3. Backup Strategy

Consider setting up backups for:
- Database (PostgreSQL)
- Application files
- Environment variables

## 📝 Final Steps

1. ✅ Update `.env` file to use HTTPS
2. ✅ Rebuild frontend with new environment
3. ✅ Update Google OAuth settings
4. ✅ Apply nginx optimizations
5. ✅ Test all functionality
6. ✅ Monitor logs for errors

## 🎉 You're Done!

Your production deployment should now be:
- ✅ Secure (HTTPS, security headers)
- ✅ Fast (HTTP/2, gzip, caching)
- ✅ Optimized (nginx, static files)
- ✅ Monitored (logs, health checks)

## Quick Reference

```bash
# Check nginx status
sudo systemctl status nginx

# Check backend status
sudo systemctl status mentraflow-api

# Check SSL certificate
sudo certbot certificates

# View nginx config
sudo nginx -T

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u mentraflow-api -f
```

