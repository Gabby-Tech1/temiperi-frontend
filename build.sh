#!/bin/bash

# Clean cache and node_modules
rm -rf node_modules
rm -rf dist
rm -f package-lock.json

# Install dependencies
npm install --legacy-peer-deps --force

# Create dist directory
mkdir -p dist

# Build the project with production environment
NODE_ENV=production npm run build

# Verify build
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    echo "Build completed successfully!"
else
    echo "Build failed - dist directory is empty or doesn't exist"
    exit 1
fi
# Build the project
npm run build
