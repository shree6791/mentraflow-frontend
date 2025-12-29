# Troubleshooting Guide

## White Page / "Practice" Issue

### Possible Causes:

1. **Backend URL Missing Port**
   - Your backend might be running on port 8000
   - Update `.env` to: `REACT_APP_BACKEND_URL=http://147.182.239.22:8000`

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
REACT_APP_BACKEND_URL=http://147.182.239.22:8000
```

### 3. Check Backend Health
Test if backend is accessible:
```bash
curl http://147.182.239.22:8000/health
# or
curl http://147.182.239.22/health
```

### 4. Check Console for Errors
- Look for red errors in Console tab
- Ignore extension errors (Emily extension)
- Focus on API-related errors

### 5. Verify Environment Variables
In console, you should see:
```
Backend URL: http://147.182.239.22
API Base: http://147.182.239.22/api/v1
```

If you see `localhost:8000`, the `.env` file isn't being loaded.

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

1. **Add Port to Backend URL:**
   ```env
   REACT_APP_BACKEND_URL=http://147.182.239.22:8000
   ```

2. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```

3. **Clear Browser Cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or clear cache in browser settings

4. **Check Backend is Running:**
   ```bash
   curl http://147.182.239.22:8000/health
   ```

## Getting Help:

If issues persist, provide:
1. Screenshot of Network tab (showing API requests)
2. Full console errors (filter out extension errors)
3. Backend logs (if accessible)
4. Response from `/health` endpoint

