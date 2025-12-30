# SSL Setup Guide with Let's Encrypt (Certbot)

This guide will help you set up HTTPS/SSL for `getmentraflow.com` using Let's Encrypt's free SSL certificates.

## Prerequisites

1. ✅ Domain `getmentraflow.com` is pointing to your server IP (`147.182.239.22`)
2. ✅ DNS has propagated (test with `ping getmentraflow.com`)
3. ✅ Nginx is installed and running
4. ✅ Port 80 (HTTP) is open in your firewall
5. ✅ Port 443 (HTTPS) is open in your firewall

## Step 1: Verify DNS is Working

Before setting up SSL, make sure your domain resolves correctly:

```bash
# From your local machine
ping getmentraflow.com
# Should return: 147.182.239.22

# Or use nslookup
nslookup getmentraflow.com
# Should return: 147.182.239.22
```

## Step 2: Connect to Your Server

```bash
ssh mentraflow@147.182.239.22
```

## Step 3: Install Certbot

```bash
# Update package list
sudo apt update

# Install Certbot and the Nginx plugin
sudo apt install certbot python3-certbot-nginx -y
```

## Step 4: Configure Firewall (if needed)

Make sure ports 80 and 443 are open:

```bash
# Check if UFW is active
sudo ufw status

# If UFW is active, allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
# Or individually:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verify
sudo ufw status
```

## Step 5: Update Nginx Configuration

Make sure your nginx config is set up to serve your domain. The current `nginx.conf` should already have `server_name getmentraflow.com www.getmentraflow.com;`

Verify the nginx config:

```bash
# Test nginx configuration
sudo nginx -t

# If there are errors, fix them first
# If successful, reload nginx
sudo systemctl reload nginx
```

## Step 6: Obtain SSL Certificate

Run Certbot to get your SSL certificate. **Replace `your-email@example.com` with your actual email:**

```bash
sudo certbot --nginx -d getmentraflow.com -d www.getmentraflow.com --email your-email@example.com --agree-tos --non-interactive
```

**What this does:**
- `--nginx`: Automatically configures Nginx for SSL
- `-d getmentraflow.com`: Domain name
- `-d www.getmentraflow.com`: Also covers www subdomain
- `--email`: Email for renewal notifications
- `--agree-tos`: Agree to Let's Encrypt terms
- `--non-interactive`: Run without prompts

**Note:** If you want to be prompted for email, remove `--non-interactive` and `--email`:

```bash
sudo certbot --nginx -d getmentraflow.com -d www.getmentraflow.com
```

## Step 7: Verify SSL Certificate

After Certbot completes, verify the certificate:

```bash
# Check certificate status
sudo certbot certificates

# Test SSL configuration
sudo certbot renew --dry-run
```

## Step 8: Test HTTPS

1. **Visit your site**: `https://getmentraflow.com`
2. **Check for SSL lock icon** in browser
3. **Test www subdomain**: `https://www.getmentraflow.com`

## Step 9: Update Frontend Configuration

After SSL is working, update your frontend `.env` file:

```bash
cd /home/mentraflow/mentraflow-frontend
nano .env
```

Update to use HTTPS:
```env
VITE_BACKEND_URL=https://getmentraflow.com
VITE_GOOGLE_CLIENT_ID=470321149192-291eh18146u9viph0637t0ke4qe8c0na.apps.googleusercontent.com
```

Rebuild and redeploy:
```bash
./scripts/update.sh
```

## Step 10: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Edit your OAuth 2.0 Client ID
4. **Add to Authorized JavaScript origins:**
   - `https://getmentraflow.com`
   - `https://www.getmentraflow.com` (if you want www)
5. **Add to Authorized redirect URIs:**
   - `https://getmentraflow.com`
   - `https://www.getmentraflow.com` (if you want www)
6. **Save**

You can keep `http://localhost:3000` for local development.

## Step 11: Verify Auto-Renewal

Certbot automatically sets up renewal, but verify it works:

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Check renewal status
sudo systemctl status certbot.timer
```

Certificates auto-renew 30 days before expiration. You can also manually renew:

```bash
sudo certbot renew
```

## Troubleshooting

### Error: "Failed to obtain certificate"

**Possible causes:**
1. DNS not propagated - wait longer or check DNS
2. Port 80 blocked - check firewall: `sudo ufw status`
3. Nginx not running - check: `sudo systemctl status nginx`
4. Domain not pointing to server - verify: `ping getmentraflow.com`

**Fix:**
```bash
# Check if nginx is running
sudo systemctl status nginx

# Check if port 80 is accessible
sudo netstat -tulpn | grep :80

# Check firewall
sudo ufw status
```

### Error: "Connection refused"

Make sure Nginx is listening on port 80:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Certificate not auto-renewing

Check Certbot timer:
```bash
sudo systemctl status certbot.timer
sudo systemctl enable certbot.timer
```

### Mixed Content Warnings

If you see mixed content warnings (HTTP resources on HTTPS page):
- Make sure `VITE_BACKEND_URL` uses `https://`
- Rebuild frontend after changing `.env`
- Clear browser cache

### Redirect Loop

If you get redirect loops, check nginx config:
```bash
sudo nginx -t
sudo cat /etc/nginx/sites-enabled/mentraflow-frontend
```

Make sure there's only one redirect from HTTP to HTTPS.

## Manual Certificate Renewal

If auto-renewal fails, manually renew:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

## Revoke Certificate (if needed)

If you need to revoke a certificate:

```bash
sudo certbot revoke --cert-path /etc/letsencrypt/live/getmentraflow.com/cert.pem
```

## Check Certificate Expiry

```bash
sudo certbot certificates
```

Or check in browser:
1. Click the lock icon
2. View certificate details
3. Check expiration date

## Security Headers (Already in nginx.conf)

Your nginx config already includes security headers:
- `Strict-Transport-Security`: Forces HTTPS
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-XSS-Protection`: XSS protection

## Next Steps

After SSL is set up:
1. ✅ Test HTTPS access
2. ✅ Update `.env` to use HTTPS
3. ✅ Rebuild frontend
4. ✅ Update Google OAuth settings
5. ✅ Test Google login with HTTPS

## Quick Reference

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d getmentraflow.com -d www.getmentraflow.com --email your-email@example.com --agree-tos --non-interactive

# Check certificates
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew
sudo systemctl reload nginx
```

