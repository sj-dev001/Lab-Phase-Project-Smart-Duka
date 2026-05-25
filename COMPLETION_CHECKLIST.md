# ✅ Migration Completion Checklist

## What You Need to Do Now

This checklist will guide you through the final setup steps to get your app live with free services.

---

## Phase 1: Local Development ✓

- [ ] **Review Changes**
  - [ ] Read `MIGRATION_SUMMARY.md` (2 min)
  - [ ] Read `QUICK_SETUP.md` (1 min)
  
- [ ] **Install Dependencies**
  ```bash
  npm run install:all
  ```
  - [ ] Server dependencies installed
  - [ ] Client dependencies installed

- [ ] **Test Locally**
  ```bash
  npm run dev
  ```
  - [ ] Backend runs on http://localhost:5000
  - [ ] Frontend runs on http://localhost:5173
  - [ ] Health check works: http://localhost:5000/api/health

---

## Phase 2: Service Accounts ⚡

### MongoDB Atlas (Database)
- [ ] Go to https://mongodb.com/cloud/atlas
- [ ] Create account (free)
- [ ] Create M0 cluster (free tier)
- [ ] Create database user: `smartduka_user`
- [ ] Whitelist IP: `0.0.0.0/0`
- [ ] Get connection string
- [ ] **Copy to `.env`:**
  ```
  MONGODB_URI=mongodb+srv://smartduka_user:<password>@cluster0.xxxxx.mongodb.net/smartduka
  ```

### Uploadthing (File Uploads)
- [ ] Go to https://uploadthing.com
- [ ] Sign up with GitHub
- [ ] Create new app
- [ ] Get API keys:
  - [ ] Copy `UPLOADTHING_SECRET`
  - [ ] Copy `UPLOADTHING_APP_ID`
- [ ] **Add to `.env`:**
  ```
  UPLOADTHING_SECRET=sk_live_xxxxx
  UPLOADTHING_APP_ID=xxxxx
  ```

### Paystack (Optional but Recommended for Testing)
- [ ] Go to https://paystack.com
- [ ] Create account
- [ ] Get test keys (for development)
- [ ] **Add to `.env`:**
  ```
  PAYSTACK_SECRET_KEY=sk_test_xxxxx
  PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
  ```

---

## Phase 3: Environment Setup 🔧

- [ ] **Create `.env` file** (if not already present)
  ```bash
  cp .env.example .env
  ```

- [ ] **Fill in all variables:**
  ```env
  NODE_ENV=development
  PORT=5000
  MONGODB_URI=mongodb+srv://smartduka_user:<your_password>@...
  JWT_SECRET=<generate-random-string>
  JWT_EXPIRES_IN=7d
  UPLOADTHING_SECRET=sk_live_...
  UPLOADTHING_APP_ID=...
  PAYSTACK_SECRET_KEY=sk_test_...
  PAYSTACK_PUBLIC_KEY=pk_test_...
  CLIENT_URL=http://localhost:5173
  ```

- [ ] **Test connection locally**
  ```bash
  npm run dev
  ```
  - [ ] No `.env` errors
  - [ ] MongoDB connects successfully
  - [ ] Server starts on port 5000

---

## Phase 4: Seed Database (Optional) 🌱

- [ ] **Run seed script** (optional, to add test data)
  
  **Option A: Basic Seeding (Placeholders)**
  From the root directory or server directory:
  ```bash
  npm run seed
  ```
  
  **Option B: Advanced Seeding (Real Images & Categories)**
  This fetches and builds a 250-product list with high-quality category mappings and images from DummyJSON, Platzi, and FakeStore APIs.
  ```bash
  # Go to seed directory and install dependencies
  cd seed && npm install
  
  # Fetch from APIs and build product array
  npm run generate:products
  
  # Connect to database and seed products with staggered timestamps
  npm run seed
  ```
  
  - [ ] Check MongoDB Atlas for test data
  - [ ] Verify products, users, categories exist

---

## Phase 5: Deploy Frontend 🚀

### Option A: Vercel (Recommended - 5 minutes)

- [ ] Push code to GitHub
  ```bash
  git add .
  git commit -m "Migrate from Azure to free services"
  git push origin main
  ```

- [ ] Go to https://vercel.com
  - [ ] Sign in with GitHub
  - [ ] Click "New Project"
  - [ ] Select your repository
  - [ ] Configure:
    - [ ] Framework: **Vite**
    - [ ] Root directory: **./client**
    - [ ] Build command: `npm run build`
  - [ ] Add environment variables:
    ```
    VITE_API_URL=https://localhost:5000/api
    ```
    *(Update this after backend deployment)*
  - [ ] Click **Deploy**

- [ ] **Test frontend:**
  - [ ] Visit https://your-project.vercel.app
  - [ ] Check homepage loads
  - [ ] Check page is responsive

---

## Phase 6: Deploy Backend 🔌

### Option A: Vercel API Routes

- [x] Create serverless API entrypoint at `server/api/index.ts`
- [x] Add Vercel routing config at `server/vercel.json`
- [ ] Create a Vercel project from the same GitHub repository
- [ ] Set root directory to `server`
- [ ] Add backend environment variables in Vercel
- [ ] Click **Deploy**
- [ ] Test `https://your-api-project.vercel.app/api/health`

### Option B: Railway.app (Alternative for Traditional Node Hosting)

- [ ] Go to https://railway.app
  - [ ] Sign in with GitHub
  - [ ] Click "New Project"
  - [ ] Select "Deploy from GitHub"
  - [ ] Select your repository
  - [ ] Configure:
    - [ ] Root directory: `/server`
    - [ ] Build command: `npm install && npm run build`
    - [ ] Start command: `npm start`
  - [ ] Add environment variables (from `.env`)
  - [ ] Click **Deploy**

- [ ] **Get backend URL:**
  - [ ] After deployment, get the domain (e.g., `https://your-api.railway.app`)
  - [ ] Test health endpoint: `https://your-api.railway.app/api/health`

---

## Phase 7: Update Configurations 🔄

- [ ] **Update Vercel environment variables**
  - [ ] Go to Vercel project settings
  - [ ] Add `VITE_API_URL=https://your-api-project.vercel.app/api`
  - [ ] Redeploy frontend

- [ ] **Verify CORS is configured**
  - [ ] Backend should allow your frontend domain
  - [ ] Check `server/src/app.ts` CORS config

---

## Phase 8: Test Production 🧪

### Frontend Tests
- [ ] Homepage loads
- [ ] Product listing works
- [ ] Product search works
- [ ] Product detail page works

### Backend Tests
- [ ] Health check endpoint works
- [ ] Product API `/api/products` returns data
- [ ] Auth endpoints are accessible
- [ ] CORS headers are correct

### Integration Tests
- [ ] Frontend connects to backend
- [ ] Can fetch products from MongoDB
- [ ] File upload works (test with Uploadthing)
- [ ] Payment flow works (with Paystack test keys)

---

## Phase 9: Production Ready 🎉

- [ ] **Switch to Production Keys (Paystack)**
  - [ ] Go to Paystack dashboard
  - [ ] Get production keys (`sk_live_...`, `pk_live_...`)
  - [ ] Update environment variables in Railway/Vercel
  - [ ] Test payment flow with real card details

- [ ] **Enable Monitoring**
  - [ ] Set up error tracking (Sentry, LogRocket, etc.)
  - [ ] Monitor MongoDB Atlas performance
  - [ ] Check Vercel analytics

- [ ] **Backup Database**
  - [ ] Enable MongoDB Atlas backups
  - [ ] Document backup location

- [ ] **Custom Domain (Optional)**
  - [ ] Purchase domain
  - [ ] Add to Vercel/Railway
  - [ ] Configure SSL certificate

---

## Phase 10: Maintenance 🔧

- [ ] **Weekly:**
  - [ ] Monitor error logs
  - [ ] Check database usage
  - [ ] Monitor file upload usage

- [ ] **Monthly:**
  - [ ] Review free tier limits
  - [ ] Plan upgrades if needed
  - [ ] Update dependencies

- [ ] **Keep backups:**
  - [ ] MongoDB backups enabled
  - [ ] Code backed up to GitHub

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| MongoDB won't connect | See `DEPLOYMENT_GUIDE.md` → MongoDB Troubleshooting |
| Uploadthing upload fails | See `DEPLOYMENT_GUIDE.md` → Uploadthing Troubleshooting |
| Frontend can't connect to backend | Check CORS config and API URL environment variable |
| Vercel build fails | Check build logs in Vercel dashboard |
| Railway deployment fails | Check Railway logs in dashboard |

---

## Need Help?

📚 **Documentation:**
- `DEPLOYMENT_GUIDE.md` - Complete step-by-step guide
- `QUICK_SETUP.md` - Quick reference
- `MIGRATION_SUMMARY.md` - Summary of changes

🔗 **Official Docs:**
- MongoDB: https://docs.mongodb.com/atlas
- Uploadthing: https://docs.uploadthing.com
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Paystack: https://paystack.com/docs

---

## ✨ Completion Status

- [ ] **Phase 1:** Local Development ✓
- [ ] **Phase 2:** Service Accounts ✓
- [ ] **Phase 3:** Environment Setup ✓
- [ ] **Phase 4:** Database Seeding (Optional)
- [ ] **Phase 5:** Frontend Deployed ✓
- [ ] **Phase 6:** Backend Deployed ✓
- [ ] **Phase 7:** Configurations Updated ✓
- [ ] **Phase 8:** Production Testing ✓
- [ ] **Phase 9:** Production Ready ✓
- [ ] **Phase 10:** Maintenance Plan ✓

**Once all phases are complete, your app is live and production-ready! 🚀**

---

## Success Metrics

- ✅ Frontend accessible at Vercel URL
- ✅ Backend accessible at Railway URL
- ✅ Products display from MongoDB
- ✅ File uploads work via Uploadthing
- ✅ Payments work with Paystack
- ✅ No Azure services required
- ✅ **Total cost: $0/month**

---

**Estimated time to completion: 30-60 minutes**

Good luck! 🎉
