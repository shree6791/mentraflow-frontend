# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth to get your `VITE_GOOGLE_CLIENT_ID`.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "MentraFlow")
5. Click **"Create"**

## Step 2: Enable Google+ API

1. In your project, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"** or **"Identity Toolkit API"**
3. Click on it and click **"Enable"**

Alternatively, you can use the newer **"Google Identity Services"** which is recommended.

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: MentraFlow (or your app name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Save and Continue"** (no need to add scopes for basic login)
7. On the **Test users** page (if in testing mode), you can add test users or skip
8. Click **"Save and Continue"** and then **"Back to Dashboard"**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. If prompted, configure the consent screen first (follow Step 3)
5. Choose **"Web application"** as the application type
6. Give it a name (e.g., "MentraFlow Web Client")
7. **Authorized JavaScript origins**:
   - Add: `http://localhost:3000` (for development)
   - Add: `http://localhost:3001` (if you use a different port)
   - Add your production URL when deploying (e.g., `https://yourdomain.com`)
8. **Authorized redirect URIs**:
   - Add: `http://localhost:3000` (for development)
   - Add your production URL when deploying
9. Click **"Create"**

## Step 5: Copy Your Client ID

1. After creating, a popup will show your **Client ID** and **Client Secret**
2. **Copy the Client ID** (it looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
3. **Important**: Keep the Client Secret secure (you won't need it for the frontend)

## Step 6: Add to Your .env File

1. Open or create `.env` file in your project root
2. Add your Client ID:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_BACKEND_URL=http://localhost:8000
```

3. Save the file
4. **Restart your development server** for the changes to take effect

## Step 7: Update App.jsx (If Needed)

Make sure your `App.jsx` wraps the app with `GoogleOAuthProvider`. Check if it's already there, if not, update it:

```javascript
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Uses VITE_GOOGLE_CLIENT_ID from .env

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {/* Your app content */}
    </GoogleOAuthProvider>
  );
}
```

## Testing

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click the Google sign-in button
4. You should see the Google sign-in popup
5. Sign in with a test user (if in testing mode) or your Google account

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure you added `http://localhost:3000` to **Authorized redirect URIs** in Google Cloud Console
- Check that the port matches your React app port

### "Error 403: access_denied"
- Make sure you've added test users in the OAuth consent screen (if in testing mode)
- Make sure the OAuth consent screen is published (for production)

### "Invalid client ID"
- Double-check that `VITE_GOOGLE_CLIENT_ID` is set correctly in your `.env` file
- Make sure you restarted the development server after adding the env variable
- Verify the Client ID in Google Cloud Console matches what's in your `.env`

### Google Sign-In Button Not Showing
- Make sure `@react-oauth/google` is installed: `npm install @react-oauth/google`
- Check browser console for errors
- Verify `GoogleOAuthProvider` is wrapping your app

## Production Deployment

When deploying to production:

1. Add your production URL to **Authorized JavaScript origins**:
   - `https://yourdomain.com`
2. Add your production URL to **Authorized redirect URIs**:
   - `https://yourdomain.com`
3. Update your production `.env` file with the same Client ID
4. Make sure your OAuth consent screen is **Published** (not in testing mode)

## Security Notes

- ⚠️ **Never commit your `.env` file** to version control
- ⚠️ The Client ID is safe to expose in frontend code (it's public)
- ⚠️ Keep your Client Secret secure (backend only, if needed)
- ✅ The `.env` file is already in `.gitignore`

## Quick Reference

- **Google Cloud Console**: https://console.cloud.google.com/
- **Credentials Page**: APIs & Services > Credentials
- **OAuth Consent Screen**: APIs & Services > OAuth consent screen
- **Documentation**: https://developers.google.com/identity/protocols/oauth2

