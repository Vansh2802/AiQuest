# ========================================
# AI QUEST - Windows PowerShell Deployment Script
# ========================================
# Run this script in PowerShell to deploy to Vercel and Railway

Write-Host "🚀 AI QUEST - Automated Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# ========================================
# STEP 1: INSTALL CLI TOOLS
# ========================================
Write-Host "📦 STEP 1: Installing CLI tools..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
npm install -g vercel
npm install -g railway

Write-Host ""
Write-Host "✅ Verifying installations..." -ForegroundColor Green
vercel --version
railway --version

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan

# ========================================
# STEP 2: BUILD FRONTEND TEST
# ========================================
Write-Host "🔨 STEP 2: Testing frontend build..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
Set-Location frontend
npm install
npm run build
Set-Location ..

Write-Host ""
Write-Host "✅ Frontend build successful!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# ========================================
# STEP 3: VERIFY BACKEND DEPENDENCIES
# ========================================
Write-Host "🐍 STEP 3: Verifying backend dependencies..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
Set-Location backend
pip install -r requirements.txt
Set-Location ..

Write-Host ""
Write-Host "✅ Backend dependencies verified!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# ========================================
# STEP 4: LOGIN TO SERVICES
# ========================================
Write-Host "🔐 STEP 4: Login to deployment services..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
Write-Host "Opening Vercel login..."
vercel login

Write-Host ""
Write-Host "Opening Railway login..."
railway login

Write-Host ""
Write-Host "✅ Authentication complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# ========================================
# STEP 5: DEPLOY BACKEND TO RAILWAY
# ========================================
Write-Host "🚂 STEP 5: Deploying backend to Railway..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
Set-Location backend

Write-Host "Initializing Railway project..."
railway init

Write-Host "Deploying backend..."
railway up

Write-Host "Generating public domain..."
railway domain

Write-Host ""
Write-Host "⚠️  IMPORTANT: Copy your Railway backend URL now!" -ForegroundColor Red
Write-Host "   Example: https://aiquest-backend-production-xxxx.up.railway.app"
Write-Host ""
Read-Host "Press Enter when you've copied the Railway URL"

Set-Location ..

Write-Host ""
Write-Host "✅ Backend deployed to Railway!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# ========================================
# STEP 6: DEPLOY FRONTEND TO VERCEL
# ========================================
Write-Host "▲ STEP 6: Deploying frontend to Vercel..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
Set-Location frontend

Write-Host "Starting Vercel deployment..."
vercel --prod

Write-Host ""
Write-Host "⚠️  IMPORTANT: Copy your Vercel frontend URL now!" -ForegroundColor Red
Write-Host "   Example: https://aiquest-frontend.vercel.app"
Write-Host ""
Read-Host "Press Enter when you've copied the Vercel URL"

Set-Location ..

Write-Host ""
Write-Host "✅ Frontend deployed to Vercel!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# ========================================
# STEP 7: CONFIGURE ENVIRONMENT VARIABLES
# ========================================
Write-Host "⚙️  STEP 7: Setting environment variables..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
Set-Location frontend

Write-Host ""
Write-Host "You need to add VITE_API_URL to Vercel..."
Write-Host "Use your Railway URL + /api"
Write-Host ""
Write-Host "Run: vercel env add VITE_API_URL"
Write-Host "Then paste: https://YOUR-RAILWAY-URL.up.railway.app/api"
Write-Host ""
Read-Host "Press Enter after setting VITE_API_URL"

Write-Host ""
Write-Host "Redeploying with environment variables..."
vercel --prod

Set-Location ..

Write-Host ""
Write-Host "✅ Environment variables configured!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# ========================================
# DEPLOYMENT COMPLETE
# ========================================
Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your application is now live!"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test your frontend URL"
Write-Host "2. Test signup/login flow"
Write-Host "3. Verify AI features work"
Write-Host "4. Check Railway backend health: /api/health"
Write-Host ""
Write-Host "Troubleshooting:" -ForegroundColor Yellow
Write-Host "- If frontend can't connect: Verify VITE_API_URL ends with /api"
Write-Host "- If backend errors: Check Railway logs: railway logs"
Write-Host "- If database issues: Verify MONGODB_URL in Railway environment"
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
