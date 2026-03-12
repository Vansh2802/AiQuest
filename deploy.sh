#!/bin/bash
# ========================================
# AI QUEST - Automated CLI Deployment Script
# ========================================
# This script automates deployment to Vercel (frontend) and Railway (backend)
# Run this script step by step or execute all at once

set -e  # Exit on error

echo "🚀 AI QUEST - Automated Deployment Script"
echo "=========================================="
echo ""

# ========================================
# STEP 1: INSTALL CLI TOOLS
# ========================================
echo "📦 STEP 1: Installing CLI tools..."
echo "-----------------------------------"
npm install -g vercel
npm install -g railway

echo ""
echo "✅ Verifying installations..."
vercel --version
railway --version

echo ""
echo "=========================================="

# ========================================
# STEP 2: BUILD FRONTEND TEST
# ========================================
echo "🔨 STEP 2: Testing frontend build..."
echo "-----------------------------------"
cd frontend
npm install
npm run build
cd ..

echo ""
echo "✅ Frontend build successful!"
echo "=========================================="

# ========================================
# STEP 3: VERIFY BACKEND DEPENDENCIES
# ========================================
echo "🐍 STEP 3: Verifying backend dependencies..."
echo "-----------------------------------"
cd backend
pip install -r requirements.txt
cd ..

echo ""
echo "✅ Backend dependencies verified!"
echo "=========================================="

# ========================================
# STEP 4: LOGIN TO SERVICES
# ========================================
echo "🔐 STEP 4: Login to deployment services..."
echo "-----------------------------------"
echo "Opening Vercel login..."
vercel login

echo ""
echo "Opening Railway login..."
railway login

echo ""
echo "✅ Authentication complete!"
echo "=========================================="

# ========================================
# STEP 5: DEPLOY BACKEND TO RAILWAY
# ========================================
echo "🚂 STEP 5: Deploying backend to Railway..."
echo "-----------------------------------"
cd backend

echo "Initializing Railway project..."
railway init

echo "Deploying backend..."
railway up

echo "Generating public domain..."
railway domain

echo ""
echo "⚠️  IMPORTANT: Copy your Railway backend URL now!"
echo "   Example: https://aiquest-backend-production-xxxx.up.railway.app"
echo ""
read -p "Press Enter when you've copied the Railway URL..."

cd ..

echo ""
echo "✅ Backend deployed to Railway!"
echo "=========================================="

# ========================================
# STEP 6: DEPLOY FRONTEND TO VERCEL
# ========================================
echo "▲ STEP 6: Deploying frontend to Vercel..."
echo "-----------------------------------"
cd frontend

echo "Starting Vercel deployment..."
vercel --prod

echo ""
echo "⚠️  IMPORTANT: Copy your Vercel frontend URL now!"
echo "   Example: https://aiquest-frontend.vercel.app"
echo ""
read -p "Press Enter when you've copied the Vercel URL..."

cd ..

echo ""
echo "✅ Frontend deployed to Vercel!"
echo "=========================================="

# ========================================
# STEP 7: CONFIGURE ENVIRONMENT VARIABLES
# ========================================
echo "⚙️  STEP 7: Setting environment variables..."
echo "-----------------------------------"
cd frontend

echo ""
echo "You need to add VITE_API_URL to Vercel..."
echo "Use your Railway URL + /api"
echo ""
echo "Run: vercel env add VITE_API_URL"
echo "Then paste: https://YOUR-RAILWAY-URL.up.railway.app/api"
echo ""
read -p "Press Enter after setting VITE_API_URL..."

echo ""
echo "Redeploying with environment variables..."
vercel --prod

cd ..

echo ""
echo "✅ Environment variables configured!"
echo "=========================================="

# ========================================
# DEPLOYMENT COMPLETE
# ========================================
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Your application is now live!"
echo ""
echo "Next steps:"
echo "1. Test your frontend URL"
echo "2. Test signup/login flow"
echo "3. Verify AI features work"
echo "4. Check Railway backend health: /api/health"
echo ""
echo "Troubleshooting:"
echo "- If frontend can't connect: Verify VITE_API_URL ends with /api"
echo "- If backend errors: Check Railway logs: railway logs"
echo "- If database issues: Verify MONGODB_URL in Railway environment"
echo ""
echo "=========================================="
