#!/usr/bin/env bash
# Root build script for Render — builds frontend & installs backend deps
set -e

echo "=== Installing frontend dependencies ==="
cd frontend
npm install
npm run build
cd ..

echo "=== Copying frontend build to backend/static ==="
rm -rf backend/static
cp -r frontend/dist backend/static

echo "=== Installing backend dependencies ==="
cd backend
pip install --upgrade pip
pip install -r requirements.txt

echo "=== Build complete ==="
