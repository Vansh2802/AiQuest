# 🗄️ MongoDB Atlas Setup (Required Before Railway Deployment)

## ⚠️ IMPORTANT: Complete This FIRST

Railway backend needs a MongoDB connection string. Set this up now:

---

## Option 1: MongoDB Atlas (Recommended - Free)

### Step 1: Create Account & Cluster

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up:** Use GitHub/Google for fastest signup
3. **Create cluster:**
   - Cluster Type: **M0 FREE**
   - Cloud Provider: **AWS**
   - Region: **Closest to you** (e.g., Mumbai for India, Oregon for US)
   - Cluster Name: `aiquest-cluster`
   - Click **Create**

### Step 2: Create Database User

1. In sidebar: **Database Access**
2. Click **Add New Database User**
3. **Username:** `aiquest-admin`
4. **Password:** Click **Autogenerate Secure Password** → **COPY IT**
   ```
   📝 Save your password: _________________________________
   ```
5. **Privileges:** Read and write to any database
6. Click **Add User**

### Step 3: Allow Network Access

1. In sidebar: **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access From Anywhere**
4. Adds `0.0.0.0/0` (allows Railway to connect)
5. Click **Confirm**

### Step 4: Get Connection String

1. In sidebar: **Database** (Overview)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Driver: **Python 3.11+**
5. **Copy the connection string:**
   ```
   mongodb+srv://aiquest-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>` with your actual password from Step 2**

### Step 5: Use in Railway

**Your final MongoDB URL should look like:**
```
mongodb+srv://aiquest-admin:YourActualPassword123@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

**Set in Railway:**
```powershell
railway variables set MONGODB_URL="mongodb+srv://aiquest-admin:YourPassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
```

---

## Option 2: Local MongoDB (Development Only)

If you want to test with local MongoDB:

**Install MongoDB:**
```powershell
# Using Chocolatey
choco install mongodb

# Start service
net start MongoDB
```

**Connection string for Railway:**
```
mongodb://localhost:27017
```

⚠️ **Note:** Local MongoDB won't work for Railway (cloud service). This is only for local testing. **Use MongoDB Atlas for production.**

---

## Option 3: MongoDB Cloud (Alternative)

Other MongoDB providers you can use:

- **MongoDB Cloud:** https://www.mongodb.com
- **DigitalOcean Managed MongoDB:** https://www.digitalocean.com/products/managed-databases-mongodb
- **AWS DocumentDB:** https://aws.amazon.com/documentdb/

---

## ✅ Verification

**Test your connection string locally:**

```powershell
cd backend
```

**Update your `.env` file with MongoDB URL:**
```env
MONGODB_URL=mongodb+srv://aiquest-admin:YourPassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=aiquest
```

**Test backend starts:**
```powershell
python -m uvicorn app.main:app --reload
```

If you see:
```
INFO: Application startup complete INFO:     Uvicorn running on http://127.0.0.1:8000
```

✅ **Your MongoDB connection works!**

---

## 🔐 Security Notes

**Password encoding:**
- If your password has special characters like `@`, `#`, `$`, etc.
- You must URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`

**Example:**
- Password: `Pass@123#`
- Encoded: `Pass%40123%23`
- Full URL: `mongodb+srv://user:Pass%40123%23@cluster.mongodb.net/...`

**Check your password:** https://www.urlencoder.org/

---

## 📊 MongoDB Atlas Free Tier Limits

- **Storage:** 512 MB
- **RAM:** Shared
- **Connections:** 500 simultaneous
- **Cost:** $0 forever

Perfect for your AI Quest app! 🎮

---

## Next Step

After completing MongoDB setup:

**Return to [CLI_DEPLOYMENT_GUIDE.md](./CLI_DEPLOYMENT_GUIDE.md)**

Continue with Step 1: Complete Railway Backend Setup

Use your MongoDB connection string in the Railway variables command.

---

**Quick MongoDB Setup Time:** ~5 minutes
