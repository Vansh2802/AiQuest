# 🚀 Quick Deployment Reference

## 📋 Pre-Deployment Checklist

```bash
# Verify frontend builds
cd frontend
npm install
npm run build

# Verify backend has all dependencies
cd ../backend
pip install -r requirements.txt
```

---

## 🔧 Railway Backend Setup

**1. Connect Repository:**
- Go to [Railway.app](https://railway.app)
- New Project → Deploy from GitHub
- Select: `Vansh2802/AiQuest`

**2. Configure:**
- Root Directory: `backend`
- Start Command: Auto-detected from `Procfile`

**3. Environment Variables:**
```bash
JWT_SECRET=<generate-with-python-command-below>
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=aiquest
PORT=8000
ANTHROPIC_API_KEY=sk-ant-xxx  # Optional
```

**Generate JWT_SECRET:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**4. Copy Railway URL:**
```
https://YOUR-APP.up.railway.app
```

---

## 🎨 Vercel Frontend Setup

**1. Connect Repository:**
- Go to [Vercel.com](https://vercel.com)
- Add New Project → Import from GitHub
- Select: `Vansh2802/AiQuest`

**2. Configure:**
- Framework: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

**3. Environment Variables:**
```bash
VITE_API_URL=https://YOUR-APP.up.railway.app/api
```
⚠️ **Important:** Include `/api` at the end!

**4. Deploy**
- Click "Deploy"
- Wait for build to complete

---

## 🗄️ MongoDB Atlas Setup

**1. Create Cluster:**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create free M0 cluster

**2. Database User:**
- Database Access → Add New User
- Username + Password
- Grant: Read and Write to any database

**3. Network Access:**
- Network Access → Add IP Address
- Allow Access from Anywhere: `0.0.0.0/0`

**4. Connection String:**
- Clusters → Connect → Connect your application
- Copy URI:
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## ✅ Verification Commands

**Test Backend Health:**
```bash
curl https://YOUR-APP.up.railway.app/api/health
```

Expected response:
```json
{"status": "ok", "app": "AI Super Quest"}
```

**Test Frontend:**
```
Open: https://YOUR-APP.vercel.app
```

---

## 📁 Important Files

| File | Purpose | Location |
|------|---------|----------|
| `vercel.json` | React Router config | `frontend/` |
| `Procfile` | Railway start command | `backend/` |
| `api.js` | Environment variable support | `frontend/src/` |
| `.env.example` | Template for secrets | `frontend/` & `backend/` |
| `DEPLOYMENT.md` | Full deployment guide | Root |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist | Root |

---

## 🔄 Continuous Deployment

Both platforms automatically deploy on push to `main`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Frontend can't connect | Check `VITE_API_URL` in Vercel, ensure `/api` suffix |
| 401 errors | Verify `JWT_SECRET` in Railway, clear localStorage |
| Backend won't start | Check Railway logs, verify `requirements.txt` |
| MongoDB connection fail | Check connection string, network access (0.0.0.0/0) |
| 404 on page refresh | Verify `vercel.json` exists in frontend folder |

---

## 📊 Cost Summary

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| **Railway** | $5 credit/month | $5+/month |
| **Vercel** | 100GB bandwidth | $20/month |
| **MongoDB Atlas** | 512MB storage | $9+/month |

---

## 🎯 Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────┐
│  Vercel (CDN)   │ ← React Frontend
│  Frontend       │    (Static Files)
└──────┬──────────┘
       │ API Calls
       ▼
┌─────────────────┐
│  Railway        │ ← FastAPI Backend
│  Backend        │    (Python Server)
└──────┬──────────┘
       │
       ├──→ MongoDB Atlas (Database)
       └──→ Anthropic API (AI Features)
```

---

## 📞 Support Links

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [GitHub Repository](https://github.com/Vansh2802/AiQuest)

---

## 🔐 Security Reminders

✅ Use strong JWT_SECRET (32+ characters)
✅ MongoDB has authentication enabled
✅ Network access configured correctly
✅ No secrets in frontend code
✅ HTTPS enabled (automatic)
✅ CORS properly configured

---

**Last Updated:** March 12, 2026

**Quick Start:** Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
