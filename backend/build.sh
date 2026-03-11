#!/usr/bin/env bash
# Build script for Render deployment
set -e

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Copy frontend build if it exists at the repo level
if [ -d "../frontend/dist" ]; then
  rm -rf static
  cp -r ../frontend/dist static
  echo "Frontend static files copied."
fi
