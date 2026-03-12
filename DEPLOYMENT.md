# 🚀 Deployment Guide - AI Quest

Complete guide for deploying AI Quest to production using Vercel (frontend) and Railway (backend).

---

## 📋 Prerequisites

Before deploying, ensure you have:

- GitHub account
- Vercel account (free tier works)
- Railway account (free tier works)
- MongoDB Atlas account (free tier works)
- (Optional) Anthropic API key for AI features

---

## 🎯 Deployment Architecture

```
User Browser
    ↓
Vercel (Frontend - React App)
    ↓
Railway (Backend - FastAPI)
    ↓
MongoDB Atlas (Database)
    ↓
Anthropic API (Optional - AI Features)
```

---

## 🔧 STEP 1: Deploy Backend to Railway

### 1.1 Push Code to GitHub

Ensure your latest code is pushed:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 1.2 Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `Vansh2802/AiQuest`
5. Select the **main** branch

### 1.3 Configure Railway Settings

Railway will auto-detect Python and install dependencies from `requirements.txt`.

**Configure Root Directory:**
- Go to **Settings** → **Root Directory**
- Set to: `backend`
- This ensures Railway runs from the backend folder

**Start Command** (Railway auto-detects from Procfile):
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 1.4 Set Environment Variables

Go to **Variables** tab and add:

**Required:**
```bash
JWT_SECRET=<generate-strong-secret-32-chars>
MONGODB_URL=<your-mongodb-atlas-connection-string>
DATABASE_NAME=aiquest
PORT=8000
```

**Optional:**
```bash
ANTHROPIC_API_KEY=sk-ant-xxx
```

**Generate JWT_SECRET:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 1.5 Get Your Railway Backend URL

After deployment completes:
1. Go to **Settings** → **Networking**
2. Click **Generate Domain**
3. Copy the URL (e.g., `https://your-app.up.railway.app`)
4. **Save this URL** - you'll need it for frontend deployment

---

## 🎨 STEP 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `Vansh2802/AiQuest`
4. Select the **main** branch

### 2.2 Configure Vercel Build Settings

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### 2.3 Set Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables**:

Add this variable:

```bash
VITE_API_URL=https://your-app.up.railway.app/api
```

**IMPORTANT:** Replace `your-app.up.railway.app` with your actual Railway URL from Step 1.5

**Note:** Make sure to include `/api` at the end!

### 2.4 Deploy Frontend

Click **"Deploy"**

Vercel will:
1. Install dependencies (`npm install`)
2. Build the React app (`npm run build`)
3. Deploy to CDN

### 2.5 Get Your Frontend URL

After deployment:
- Vercel provides a URL like: `https://aiquest.vercel.app`
- You can also add a custom domain in Vercel settings

---

## 🗄️ STEP 3: Configure MongoDB Atlas

### 3.1 Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Choose a cloud provider and region (same region as Railway for best performance)

### 3.2 Create Database User

1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Create username and password
4. Grant **"Read and Write"** permissions

### 3.3 Configure Network Access

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is needed for Railway to connect

### 3.4 Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add this to Railway environment variables as `MONGODB_URL`

---

## ✅ STEP 4: Verify Deployment

### 4.1 Test Backend API

Visit your Railway URL:
```
https://your-app.up.railway.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "app": "AI Super Quest"
}
```

### 4.2 Test Frontend

Visit your Vercel URL:
```
https://aiquest.vercel.app
```

You should see the landing page.

### 4.3 Test Complete Flow

1. **Sign Up:** Create a new account
2. **Select Interests:** Choose learning topics
3. **Dashboard:** Verify it loads with topics
4. **Study:** Try learning a topic
5. **Quiz:** Take a quiz and earn XP

---

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

**Vercel:** Automatically deploys on every push to `main` branch
**Railway:** Automatically deploys on every push to `main` branch

To deploy updates:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both services will automatically rebuild and deploy.

---

## 🐛 Troubleshooting

### Frontend shows "Network Error"

**Problem:** Frontend can't connect to backend

**Solutions:**
1. Check `VITE_API_URL` is set correctly in Vercel
2. Verify Railway backend is running (check logs)
3. Ensure `/api` is included in the URL
4. Check CORS is enabled in backend (already configured)

### Backend shows "Connection refused" to MongoDB

**Problem:** Can't connect to database

**Solutions:**
1. Verify `MONGODB_URL` is correct in Railway
2. Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
3. Verify database user credentials are correct
4. Check MongoDB Atlas cluster is running

### 401 Unauthorized errors

**Problem:** JWT authentication failing

**Solutions:**
1. Verify `JWT_SECRET` is set in Railway
2. Clear browser localStorage and cookies
3. Try signing up with a new account
4. Check Railway logs for authentication errors

### "Module not found" errors in Railway

**Problem:** Backend dependencies not installed

**Solutions:**
1. Verify `requirements.txt` is in backend folder
2. Check Railway root directory is set to `backend`
3. Review Railway build logs for errors

### React Router shows 404 on refresh

**Problem:** Vercel not serving index.html for all routes

**Solutions:**
1. Verify `vercel.json` exists in frontend folder
2. Check vercel.json routing configuration
3. Redeploy frontend

---

## 📊 Monitoring

### Railway Logs

View backend logs:
1. Go to Railway dashboard
2. Click on your project
3. Click **"Logs"** tab
4. See real-time API requests and errors

### Vercel Logs

View frontend deployment logs:
1. Go to Vercel dashboard
2. Click on your project
3. Click **"Deployments"**
4. Click on a deployment to see build logs

---

## 🔐 Security Checklist

Before going live:

- [ ] Strong JWT_SECRET set (32+ characters)
- [ ] MongoDB has authentication enabled
- [ ] MongoDB network access configured
- [ ] No secrets in frontend .env
- [ ] CORS configured but not too permissive (consider restricting to your domain)
- [ ] HTTPS enabled (automatic on Vercel and Railway)

---

## 💰 Cost Estimates

**Free Tier Limits:**

| Service | Free Tier | Upgrade Needed |
|---------|-----------|----------------|
| **Vercel** | 100GB bandwidth/month | High traffic sites |
| **Railway** | $5 credit/month | Continuous usage |
| **MongoDB Atlas** | 512MB storage | Large databases |
| **Anthropic API** | Pay per token | AI features only |

**Note:** Railway's free tier may sleep after inactivity. For production, consider the $5/month plan.

---

## 🎯 Production Optimizations

### Performance

1. **Enable caching** in Vercel (already configured in vercel.json)
2. **Use CDN** for static assets (automatic on Vercel)
3. **Database indexing** in MongoDB for faster queries
4. **Connection pooling** in backend (Motor already does this)

### Scaling

1. **Railway:** Scale to multiple instances if needed
2. **MongoDB:** Upgrade to dedicated cluster for high traffic
3. **Vercel:** No configuration needed, scales automatically

---

## 📞 Support

**Issues?**
- Check Railway logs for backend errors
- Check Vercel build logs for frontend errors
- Review MongoDB Atlas monitoring
- Check GitHub repository issues

**Documentation:**
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

---

## ✅ Deployment Checklist

Use this checklist to verify your deployment:

### Backend (Railway)
- [ ] Repository connected to Railway
- [ ] Root directory set to `backend`
- [ ] All environment variables configured
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB connection string added
- [ ] Backend is running (check `/api/health`)
- [ ] Logs show no errors

### Frontend (Vercel)
- [ ] Repository connected to Vercel
- [ ] Root directory set to `frontend`
- [ ] Build settings configured (Vite preset)
- [ ] VITE_API_URL environment variable set
- [ ] Deployment successful
- [ ] Can access landing page
- [ ] Can sign up and login

### Database (MongoDB Atlas)
- [ ] Cluster created and running
- [ ] Database user created with password
- [ ] Network access allows 0.0.0.0/0
- [ ] Connection string copied to Railway

### Testing
- [ ] Signup works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Topics display correctly
- [ ] Learning path works
- [ ] Quiz functionality works
- [ ] XP system works
- [ ] Logout works

---

## 🎉 Success!

Your AI Quest application is now live and ready for users!

**Frontend:** `https://your-app.vercel.app`
**Backend:** `https://your-app.up.railway.app`

Share your app and start your gamified learning journey! 🚀🎮

---

Last Updated: March 12, 2026
