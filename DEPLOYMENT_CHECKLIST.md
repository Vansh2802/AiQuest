# 🚀 Quick Deployment Checklist

Use this checklist to deploy AI Quest step-by-step.

---

## 📦 Pre-Deployment Preparation

- [ ] Code is pushed to GitHub (`git push origin main`)
- [ ] All tests pass locally
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend runs without errors locally

---

## 🗄️ MongoDB Atlas Setup

- [ ] Created MongoDB Atlas account
- [ ] Created free M0 cluster
- [ ] Created database user with password
- [ ] Configured network access (allow 0.0.0.0/0)
- [ ] Copied connection string

---

## 🚂 Railway Backend Deployment

### Setup
- [ ] Created Railway account
- [ ] Connected GitHub repository
- [ ] Selected `Vansh2802/AiQuest` repository
- [ ] Set root directory to `backend`

### Environment Variables
- [ ] `JWT_SECRET` = (generated 32-char secret)
- [ ] `MONGODB_URL` = (MongoDB Atlas connection string)
- [ ] `DATABASE_NAME` = `aiquest`
- [ ] `PORT` = `8000`
- [ ] `ANTHROPIC_API_KEY` = (optional, for AI features)

### Verification
- [ ] Deployment completed successfully
- [ ] Generated public domain
- [ ] Copied Railway URL: `https://__________.up.railway.app`
- [ ] Tested health endpoint: `/api/health` returns status ok

---

## 🎨 Vercel Frontend Deployment

### Setup
- [ ] Created Vercel account
- [ ] Imported GitHub repository
- [ ] Selected `Vansh2802/AiQuest` repository
- [ ] Set root directory to `frontend`
- [ ] Set framework preset to `Vite`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables
- [ ] `VITE_API_URL` = `https://__________.up.railway.app/api`
  - ⚠️ Don't forget `/api` at the end!

### Verification
- [ ] Deployment completed successfully
- [ ] Copied Vercel URL: `https://__________.vercel.app`
- [ ] Landing page loads correctly
- [ ] All routes work (refresh test)

---

## ✅ Complete Application Testing

### Authentication
- [ ] Can access signup page
- [ ] Signup creates new account
- [ ] Login sound plays after signup
- [ ] Redirects to interests page

### Interests Selection
- [ ] Interests page displays all categories
- [ ] Can select multiple interests
- [ ] "SAVE INTERESTS" button works
- [ ] Redirects to dashboard

### Dashboard
- [ ] Dashboard loads without blank screen
- [ ] Shows user profile (username, XP, level)
- [ ] Displays Learning Path Map
- [ ] Shows suggested topics with descriptions
- [ ] Daily challenges visible
- [ ] Stats cards display correctly

### Learning Features
- [ ] Can click on topics
- [ ] Study page loads topic content
- [ ] YouTube videos embed correctly
- [ ] AI explanations generate (or fallback works)
- [ ] Quiz generates questions
- [ ] Can submit quiz answers
- [ ] XP increases after quiz
- [ ] Completed topics tracked

### Navigation
- [ ] Navbar appears on all pages
- [ ] STATS link goes to dashboard
- [ ] LEARN link goes to topics page
- [ ] LOGOUT clears session and redirects

### Learning Path
- [ ] Path displays on dashboard
- [ ] Shows correct number of level nodes
- [ ] Player marker positioned correctly
- [ ] Can click unlocked nodes
- [ ] Locked nodes are disabled

### UI/UX
- [ ] Retro theme displays correctly
- [ ] Animations work smoothly
- [ ] Parallax landing page works
- [ ] Hover effects work on buttons
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone)

---

## 🔍 Post-Deployment Verification

### Performance
- [ ] Page load times acceptable (< 3 seconds)
- [ ] API responses fast (< 1 second)
- [ ] No 404 errors in network tab
- [ ] Images and assets load correctly

### Security
- [ ] HTTPS enabled (automatic)
- [ ] JWT tokens working correctly
- [ ] Login required for protected pages
- [ ] No secrets visible in frontend code
- [ ] Unauthorized requests return 401

### Database
- [ ] Users are being created in MongoDB
- [ ] Topics are being saved
- [ ] XP is being updated
- [ ] Completed topics tracked

---

## 📊 Monitoring Setup

- [ ] Railway logs accessible
- [ ] Vercel deployments visible
- [ ] MongoDB Atlas monitoring enabled
- [ ] Set up alerts for errors (optional)

---

## 🎉 Launch

- [ ] All tests passed
- [ ] No critical errors in logs
- [ ] Application is publicly accessible
- [ ] Ready to share with users!

### Your Live URLs

**Frontend:** `https://_______________________________.vercel.app`

**Backend:** `https://_______________________________.up.railway.app`

---

## 📝 Notes

Write any issues or observations here:

```
[Space for notes]






```

---

## 🔄 Next Steps After Launch

1. **Monitor logs** for the first 24 hours
2. **Test with real users** and gather feedback
3. **Set up custom domain** (optional)
4. **Configure analytics** (optional)
5. **Plan for scaling** if traffic increases

---

## 🆘 Quick Troubleshooting

**Frontend can't connect to backend:**
- Check VITE_API_URL in Vercel
- Verify Railway backend is running
- Ensure `/api` is in the URL

**Authentication failing:**
- Check JWT_SECRET in Railway
- Clear browser localStorage
- Try signup with new account

**Dashboard blank:**
- Check browser console for errors
- Verify MongoDB connection in Railway logs
- Test API endpoints directly

---

**Last Updated:** March 12, 2026

**Deployed By:** ________________

**Date Deployed:** ________________
