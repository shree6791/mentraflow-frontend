#!/bin/bash

# MentraFlow Frontend Update Script
# This script updates the frontend on the droplet by pulling latest changes and rebuilding

set -e  # Exit on error

# Configuration
FRONTEND_DIR="/home/mentraflow/mentraflow-frontend"
APP_USER="mentraflow"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 MentraFlow Frontend Update${NC}"
echo -e "${BLUE}==============================${NC}"

# Check if we're in the frontend directory
if [ ! -f package.json ]; then
    echo -e "${RED}Error: package.json not found. Please run from the frontend directory.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 20+ (LTS) first.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}Node.js version 20+ (LTS) is required. Current version: $(node -v)${NC}"
    echo -e "${YELLOW}Note: Node.js 18.x is deprecated. Please upgrade to Node.js 20.x LTS.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found.${NC}"
    echo -e "${YELLOW}   Make sure .env is configured before building.${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Note: Code should be copied via SCP/rsync from local machine
# This script assumes code is already on the server
echo -e "${YELLOW}ℹ️  Note: Code should be copied via SCP/rsync before running this script${NC}"

# Install/update dependencies
echo -e "${YELLOW}📦 Installing/updating dependencies...${NC}"
npm ci --production=false
echo -e "${GREEN}✓ Dependencies updated${NC}"

# Build production bundle
echo -e "${YELLOW}🔨 Building production bundle...${NC}"
# Show current directory for debugging
echo -e "${YELLOW}Current directory: $(pwd)${NC}"

# Run build and capture exit code
if ! npm run build; then
    echo -e "${RED}Error: Build command failed.${NC}"
    exit 1
fi

# Verify build directory exists (Vite uses 'dist' instead of 'build')
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build directory (dist) not created. Build failed.${NC}"
    echo -e "${YELLOW}Checking current directory contents:${NC}"
    ls -la
    exit 1
fi

# Verify build directory has content
if [ ! -f "dist/index.html" ]; then
    echo -e "${RED}Error: Build directory exists but index.html is missing. Build may have failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully${NC}"
echo -e "${GREEN}✓ Build directory verified: $(pwd)/dist${NC}"

# Deploy new build
echo -e "${YELLOW}🚀 Deploying new build...${NC}"
echo -e "${YELLOW}Source: $(pwd)/dist${NC}"
echo -e "${YELLOW}Destination: $FRONTEND_DIR/build${NC}"

# Verify build directory still exists before copying
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build directory (dist) disappeared! Current directory: $(pwd)${NC}"
    ls -la
    exit 1
fi

mkdir -p "$FRONTEND_DIR"
rm -rf "$FRONTEND_DIR/build"
cp -r dist "$FRONTEND_DIR/build"

# Verify copy succeeded
if [ ! -d "$FRONTEND_DIR/build" ]; then
    echo -e "${RED}Error: Copy failed. Destination directory not created.${NC}"
    exit 1
fi

# Set proper permissions
if [ "$EUID" -eq 0 ]; then
    chown -R $APP_USER:$APP_USER "$FRONTEND_DIR/build"
fi
chmod -R 755 "$FRONTEND_DIR/build"

echo -e "${GREEN}✓ Files deployed to $FRONTEND_DIR/build${NC}"

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

echo -e "${GREEN}✅ Update completed successfully!${NC}"
echo -e "${GREEN}🌐 Frontend is now live at http://147.182.239.22${NC}"

