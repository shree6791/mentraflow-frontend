#!/bin/bash

# MentraFlow Frontend Deployment Script
# This script builds and deploys the React app to a DigitalOcean droplet

set -e  # Exit on error

echo "🚀 Starting MentraFlow Frontend Deployment..."

# Configuration
DEPLOY_DIR="/home/mentraflow/mentraflow-frontend"
APP_USER="mentraflow"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as correct user or with sudo
if [ "$EUID" -ne 0 ] && [ "$USER" != "$APP_USER" ]; then 
    echo -e "${YELLOW}Running as $USER. Some operations may require sudo.${NC}"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

# Navigate to project root (parent of scripts directory)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

echo -e "${YELLOW}📦 Installing/updating dependencies...${NC}"
npm ci --production=false

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from env.production.example...${NC}"
    if [ -f env.production.example ]; then
        cp env.production.example .env
        echo -e "${YELLOW}⚠️  Please update .env with your production values!${NC}"
    else
        echo -e "${RED}Error: env.production.example not found. Please create .env file manually.${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}🔨 Building production bundle...${NC}"
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}Error: Build directory not created. Build failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully${NC}"

# Create deployment directory if it doesn't exist
mkdir -p "$DEPLOY_DIR"

# Deploy new build
echo -e "${YELLOW}🚀 Deploying new build...${NC}"
rm -rf "$DEPLOY_DIR/build"
cp -r build "$DEPLOY_DIR/"

# Set proper permissions
if [ "$EUID" -eq 0 ]; then
    chown -R $APP_USER:$APP_USER "$DEPLOY_DIR/build"
fi
chmod -R 755 "$DEPLOY_DIR/build"

echo -e "${GREEN}✓ Files deployed to $DEPLOY_DIR/build${NC}"

# Test nginx configuration
if command -v nginx &> /dev/null; then
    echo -e "${YELLOW}🔍 Testing nginx configuration...${NC}"
    if sudo nginx -t 2>/dev/null || nginx -t 2>/dev/null; then
        echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
        echo -e "${YELLOW}🔄 Reloading nginx...${NC}"
        sudo systemctl reload nginx 2>/dev/null || systemctl reload nginx 2>/dev/null || echo -e "${YELLOW}⚠️  Could not reload nginx. Please reload manually: sudo systemctl reload nginx${NC}"
        echo -e "${GREEN}✓ Nginx reloaded${NC}"
    else
        echo -e "${RED}⚠️  Nginx configuration test failed. Please check nginx configuration${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Nginx not found. Skipping nginx reload.${NC}"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your app should now be live at your server's IP or domain${NC}"

