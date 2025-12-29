# Troubleshooting Guide

## White Page / "Practice" Issue

### Possible Causes:

1. **Backend URL Configuration**
   - For development: `VITE_BACKEND_URL=http://localhost:8000`
   - For production: `VITE_BACKEND_URL=http://147.182.239.22`
   - Update `.env` file accordingly

2. **CORS Issues**
   - Check Network tab in DevTools
   - Look for failed requests to `/api/v1/*`
   - Backend needs to allow `http://localhost:3000` in CORS settings

3. **Empty API Response**
   - Console shows `{result: {}}` - API might be returning empty data
   - Check Network tab to see actual API responses

## Debugging Steps:

### 1. Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by "Fetch/XHR"
4. Look for requests to `/api/v1/*`
5. Check:
   - Status codes (should be 200, not 404 or 500)
   - Response data
   - CORS errors (red, blocked requests)

### 2. Verify Backend Port
Your backend might need a port number. Common ports:
- `8000` - Default FastAPI port
- `3000` - Alternative
- `5000` - Flask default

Try updating `.env`:
```env
VITE_BACKEND_URL=http://localhost:8000
```

### 3. Check Backend Health
Test if backend is accessible:
```bash
# Development (direct backend)
curl http://localhost:8000/health

# Production (through nginx)
curl http://147.182.239.22/health
```

### 4. Check Console for Errors
- Look for red errors in Console tab
- Ignore extension errors (Emily extension)
- Focus on API-related errors

### 5. Verify Environment Variables
Check that your `.env` file uses `VITE_` prefix:
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-client-id
```

Restart the dev server after changing `.env` files.

## Common Issues:

### Issue: Empty Result Object
**Symptom:** Console shows `{result: {}}`

**Solution:**
- Check Network tab for actual API response
- Verify backend is running and accessible
- Check if API endpoint exists: `/api/v1/auth/me` or similar

### Issue: CORS Error
**Symptom:** Network tab shows blocked requests

**Solution:**
- Backend needs to allow your frontend origin
- Add to backend CORS settings: `http://localhost:3000`

### Issue: 404 Not Found
**Symptom:** API requests return 404

**Solution:**
- Verify API path: `/api/v1/*`
- Check backend routes are registered
- Ensure backend is running

### Issue: White Page
**Symptom:** Page loads but shows white screen

**Solution:**
- Check browser console for React errors
- Verify all components are imported correctly
- Check if there's a JavaScript error preventing render

## Quick Fixes:

1. **Check Environment Variables:**
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your-client-id
   ```

2. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Clear Browser Cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or clear cache in browser settings

4. **Check Backend is Running:**
   ```bash
   curl http://localhost:8000/health
   ```

## Browser Issues

### Issue: App works in Cursor browser but not in Chrome

**Common Causes:**
1. **Browser Extensions Interfering** - Chrome extensions (like Emily extension) can block or modify page content
2. **Cached Content** - Chrome aggressively caches JavaScript and CSS
3. **Service Workers** - Service workers can cache old versions
4. **Browser Security Settings** - Chrome's security settings might block certain features

**Solutions (Try in Order):**

1. **Hard Refresh (Most Common Fix)**
   - **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
   - **Mac:** `Cmd + Shift + R`
   - This bypasses cache and reloads everything fresh

2. **Clear Browser Cache**
   - Open Chrome DevTools (F12)
   - Right-click the refresh button → "Empty Cache and Hard Reload"
   - Or go to Settings → Privacy → Clear browsing data → Cached images and files

3. **Disable Extensions (Temporarily)**
   - Go to `chrome://extensions/`
   - Toggle off all extensions (especially Emily extension)
   - Refresh the page
   - If it works, enable extensions one by one to find the culprit

4. **Use Incognito Mode**
   - Open Chrome Incognito window (`Ctrl+Shift+N` or `Cmd+Shift+N`)
   - Navigate to `http://localhost:3000`
   - This disables extensions and uses fresh cache
   - If it works in incognito, it's an extension or cache issue

5. **Clear Service Workers**
   - Open DevTools (F12) → **Application** tab
   - Click **Service Workers** in left sidebar
   - Click **Unregister** for any service workers
   - Refresh the page

**Most Likely Fix:** Try Incognito Mode First - This will quickly tell you if it's an extension or cache issue.

## Getting Help:

If issues persist, provide:
1. Screenshot of Network tab (showing API requests)
2. Full console errors (filter out extension errors)
3. Backend logs (if accessible)
4. Response from `/health` endpoint

