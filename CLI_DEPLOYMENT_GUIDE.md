# 🚀 CLI DEPLOYMENT COMMANDS - Execute These Step by Step

## ✅ COMPLETED:
- [x] Install Vercel CLI (v50.32.3)  
- [x] Install Railway CLI (v4.31.0)
- [x] Verify frontend build (SUCCESS - 377.66 kB)
- [x] Login to Vercel (Authenticated)
- [x] Login to Railway (Authenticated as Vansh Asnani)

---

## 📋 NEXT STEPS - Execute in Terminal:

### STEP 1: Complete Railway Backend Setup

**You're currently at the Railway init prompt. Complete it:**

```powershell
# Enter project name when prompted:
aiquest-backend

# OR press Enter for random name
```

**After project is created, set environment variables:**

```powershell
# Set JWT secret
railway variables set JWT_SECRET=0sRBBLTijFJG57-S1J_l14jd2jXVbEFJVYIuy_vJ2_s

# Set MongoDB URL (replace with your actual MongoDB connection string)
railway variables set MONGODB_URL="mongodb://localhost:27017"

# Set database name
railway variables set DATABASE_NAME=aiquest

# Set port
railway variables set PORT=8000

# Set Anthropic API key (optional)
railway variables set ANTHROPIC_API_KEY="your-anthropic-api-key-here"
```

**Deploy backend:**

```powershell
railway up
```

**Generate public domain:**

```powershell
railway domain
```

**Copy the URL shown (example):**
```
https://aiquest-backend-production-xxxx.up.railway.app
```

**Test backend health:**
```powershell
# Replace with your actual Railway URL
curl https://YOUR-RAILWAY-URL.up.railway.app/api/health
```

---

### STEP 2: Deploy Frontend to Vercel

**Navigate to frontend:**

```powershell
cd ..
cd frontend
```

**Deploy to Vercel:**

```powershell
vercel --prod
```

**Follow the prompts:**
- Setup and deploy? **Y**
- Which scope? **Select your account**
- Link to existing project? **N**
- Project name? **aiquest-frontend** (or keep default)
- Directory? **.** (current directory)
- Override settings? **N**

**Vercel will build and deploy. Copy the production URL:**
```
https://aiquest-frontend.vercel.app
```

---

### STEP 3: Configure Frontend Environment Variable

**Add VITE_API_URL to Vercel:**

```powershell
vercel env add VITE_API_URL
```

**When prompted:**
- Environment variable name? **VITE_API_URL**
- Value? **https://YOUR-RAILWAY-URL.up.railway.app/api**
  - ⚠️ IMPORTANT: Use your Railway URL from Step 1 + `/api`
  - Example: `https://aiquest-backend-production-xxxx.up.railway.app/api`
- Add to (select all):
  - **Production** (Y)
  - **Preview** (Y)
  - **Development** (Y)

**Redeploy with new environment variable:**

```powershell
vercel --prod
```

---

### STEP 4: Verify Deployment

**Open your Vercel URL in browser:**
```
https://your-app.vercel.app
```

**Test the application:**
1. ✅ Landing page loads
2. ✅ Click "Get Started"
3. ✅ Sign up with test account
4. ✅ Select interests
5. ✅ Dashboard loads with topics
6. ✅ Navigate to Learn page
7. ✅ Try AI explanation feature
8. ✅ Test quiz system

**Check backend health:**
```
https://YOUR-RAILWAY-URL.up.railway.app/api/health
```
Should return: `{"status":"ok","app":"AI Super Quest"}`

**Check API documentation:**
```
https://YOUR-RAILWAY-URL.up.railway.app/docs
```

---

## 🐛 Troubleshooting Commands

**View Railway logs:**
```powershell
cd backend
railway logs
```

**View Vercel logs:**
```powershell
cd frontend
vercel logs
```

**Update Railway environment variable:**
```powershell
railway variables set VARIABLE_NAME="new value"
```

**Update Vercel environment variable:**
```powershell
vercel env rm VITE_API_URL production
vercel env add VITE_API_URL
```

**Redeploy Railway:**
```powershell
cd backend
railway up --detach
```

**Redeploy Vercel:**
```powershell
cd frontend
vercel --prod
```

---

## 📌 Quick Reference

### Your Configuration:

**Backend (Railway):**
- Root directory: `backend`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables: JWT_SECRET, MONGODB_URL, DATABASE_NAME, PORT

**Frontend (Vercel):**
- Root directory: `frontend`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: VITE_API_URL

---

## 🎉 After Deployment

**Your live URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-railway-url.up.railway.app`
- API Docs: `https://your-railway-url.up.railway.app/docs`

**Continuous deployment:**
```bash
git add .
git commit -m "Update feature"
git push origin main
```
Both services will auto-deploy on push!

---

## ⚡ Alternative: Use Web Dashboards

If CLI gives issues, you can also deploy via web:

**Railway:**
1. Go to https://railway.app/dashboard
2. New Project → Deploy from GitHub
3. Select `Vansh2802/AiQuest`
4. Set root directory: `backend`
5. Add environment variables
6. Generate domain

**Vercel:**
1. Go to https://vercel.com/dashboard
2. Add New Project
3. Import `Vansh2802/AiQuest`
4. Set root directory: `frontend`
 5. Set framework: Vite
6. Add VITE_API_URL environment variable
7. Deploy

---

**Current Status:** Complete the Railway project name prompt in your terminal, then continue with the commands above!
