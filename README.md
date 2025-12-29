# MentraFlow Frontend

Modern React frontend for MentraFlow - an AI-powered learning platform with flashcards, knowledge graphs, and study assistance.

## Features

- 📚 **Document Management** - Upload and organize study materials
- 🧠 **Knowledge Graph** - Visualize concepts and relationships
- 📖 **Smart Flashcards** - AI-generated MCQ and Q&A flashcards
- 💬 **Study Assistant** - Chat with your documents
- 🎯 **Workspace-based** - Organize content by workspace
- 🔐 **Authentication** - Email/password and Google OAuth

## Tech Stack

- **React 19** - UI framework
- **Vite 6** - Build tool and dev server (fast, modern)
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## Prerequisites

- Node.js 20+ (LTS recommended) and npm/yarn
- Backend API running (see [mentraflow-backend](https://github.com/shree6791/mentraflow-backend))

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure environment:**
   ```bash
   cp env.production.example .env
   ```

   Edit `.env` and set:
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```
   
   For Google OAuth setup, see [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)

3. **Start development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components (Button, Card, Input, etc.)
│   └── AppLayout.jsx  # Main layout with sidebar
├── context/          # React contexts
│   ├── AuthContext.jsx      # Authentication state
│   └── WorkspaceContext.jsx # Workspace management
├── pages/            # Page components
│   ├── Home.jsx       # Landing page
│   ├── Login.jsx      # Authentication
│   ├── Dashboard.jsx  # Main dashboard
│   ├── Documents.jsx  # Document management
│   ├── Flashcards.jsx # Flashcard study interface
│   ├── KnowledgeGraph.jsx # Knowledge graph visualization
│   ├── Chat.jsx       # Study assistant chat
│   └── Settings.jsx   # User settings
├── services/         # API integration
│   └── api.js        # Centralized API service layer
├── constants/        # Constants and theme
│   └── theme.js      # Theme colors and spacing
└── lib/              # Utilities
    └── utils.js      # Helper functions
```

## API Integration

The frontend integrates with the FastAPI backend at `/api/v1`. All API calls are centralized in `src/services/api.js`:

- **Auth Service** - Signup, login, Google OAuth
- **Workspace Service** - CRUD operations
- **Document Service** - Upload, list, process documents
- **Flashcard Service** - List, review flashcards
- **Knowledge Graph Service** - Concepts and relationships
- **Chat Service** - Study assistant
- **Notes Service** - Note management
- **Preferences Service** - User preferences

## Key Features

### Authentication
- Email/password signup and login
- Google OAuth integration
- Protected routes
- Persistent sessions

### Workspace Management
- Create and switch workspaces
- Workspace-scoped content
- Multi-workspace support

### Document Processing
- Text document upload
- Automatic ingestion (chunking + embeddings)
- Summary generation
- Flashcard generation
- Knowledge graph extraction

### Study Tools
- MCQ and Q&A flashcards
- Spaced repetition support
- Knowledge graph visualization
- Chat-based study assistant

## Development

### Available Scripts

- `npm run dev` - Start Vite development server (fast HMR)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally

### Environment Variables

Vite uses `VITE_` prefix for environment variables:

- `VITE_BACKEND_URL` - Backend API URL (default: http://localhost:8000)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

**Note:** Environment variables must be prefixed with `VITE_` to be exposed to the client. The code uses `process.env.REACT_APP_*` for backward compatibility, but your `.env` file should use `VITE_` prefix.

## Backend Integration

This frontend is designed to work with the [MentraFlow Backend](https://github.com/shree6791/mentraflow-backend). Ensure:

1. Backend is running on the configured URL
2. CORS is properly configured in backend
3. Authentication endpoints are accessible
4. Database and Qdrant are set up

## UI/UX Improvements

This frontend includes several improvements over the original:

- ✅ Modern, clean design with Tailwind CSS
- ✅ Responsive layout (mobile-friendly)
- ✅ Better component organization
- ✅ Improved error handling
- ✅ Loading states and feedback
- ✅ Toast notifications
- ✅ Accessible components (Radix UI)
- ✅ Consistent theming

## Next Steps

- [ ] Add file upload support (PDF, DOCX)
- [ ] Implement full knowledge graph visualization (D3.js)
- [ ] Add document preview
- [ ] Enhance flashcard review UI
- [ ] Add progress tracking
- [ ] Implement search functionality
- [ ] Add dark mode support

## Deployment Scripts

Scripts for deployment are located in the `scripts/` folder:

- **`scripts/deploy.sh`** - Initial deployment on the server (builds and deploys)
- **`scripts/update.sh`** - Update on server (rebuilds and deploys after copying code via SCP)

**Note:** Code is deployed using SCP/rsync from your local machine. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

## Documentation

Additional documentation is available in the `docs/` folder:

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Complete guide for deploying to DigitalOcean droplet
- **[Google OAuth Setup](docs/GOOGLE_OAUTH_SETUP.md)** - Step-by-step Google OAuth configuration
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common development issues and browser troubleshooting
- **[Frontend Deployment Troubleshooting](docs/TROUBLESHOOTING_FRONTEND.md)** - Server deployment issues

## License

MIT

