# Chrome Browser Issues - Troubleshooting Guide

## Issue: App works in Cursor browser but not in Chrome

### Common Causes:

1. **Browser Extensions Interfering**
   - Chrome extensions (like Emily extension) can block or modify page content
   - Extensions can inject scripts that conflict with React

2. **Cached Content**
   - Chrome aggressively caches JavaScript and CSS
   - Old cached version might be broken

3. **Service Workers**
   - Service workers can cache old versions
   - Can prevent new code from loading

4. **Browser Security Settings**
   - Chrome's security settings might block certain features
   - CORS or content security policies

## Solutions (Try in Order):

### 1. Hard Refresh (Most Common Fix)
- **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`
- This bypasses cache and reloads everything fresh

### 2. Clear Browser Cache
1. Open Chrome DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or go to Settings → Privacy → Clear browsing data → Cached images and files

### 3. Disable Extensions (Temporarily)
1. Go to `chrome://extensions/`
2. Toggle off all extensions (especially Emily extension)
3. Refresh the page
4. If it works, enable extensions one by one to find the culprit

### 4. Use Incognito Mode
1. Open Chrome Incognito window (`Ctrl+Shift+N` or `Cmd+Shift+N`)
2. Navigate to `http://localhost:3000`
3. This disables extensions and uses fresh cache
4. If it works in incognito, it's an extension or cache issue

### 5. Clear Service Workers
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in left sidebar
4. Click **Unregister** for any service workers
5. Refresh the page

### 6. Check Console for Errors
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for red errors
4. Filter out extension errors (they're usually from `chrome-extension://`)

### 7. Disable Chrome Security Features (Development Only)
If CORS is blocking:
1. Close all Chrome windows
2. Open Chrome with flags:
   ```bash
   # Mac
   open -a "Google Chrome" --args --disable-web-security --user-data-dir=/tmp/chrome_dev
   
   # Windows
   chrome.exe --disable-web-security --user-data-dir="C:/tmp/chrome_dev"
   ```
   ⚠️ **Warning:** Only use for development, not for regular browsing!

### 8. Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for:
   - Failed requests (red)
   - Blocked requests
   - 404 errors
   - CORS errors

### 9. Reset Chrome Settings (Last Resort)
1. Go to `chrome://settings/reset`
2. Click "Restore settings to their original defaults"
3. ⚠️ This will reset all Chrome settings

## Quick Test Checklist:

- [ ] Hard refresh (`Cmd+Shift+R` or `Ctrl+Shift+R`)
- [ ] Try incognito mode
- [ ] Disable all extensions
- [ ] Clear cache
- [ ] Check console for errors
- [ ] Check Network tab for failed requests

## Most Likely Fix:

**Try Incognito Mode First** - This will quickly tell you if it's an extension or cache issue.

If it works in incognito:
- It's an extension problem → Disable extensions one by one
- It's a cache problem → Clear cache and hard refresh

If it doesn't work in incognito:
- Check console for JavaScript errors
- Check Network tab for failed requests
- Verify the dev server is running

