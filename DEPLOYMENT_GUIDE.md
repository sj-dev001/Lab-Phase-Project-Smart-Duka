# Migration from Azure to Free Alternatives - Complete Guide

## Overview
Your Smart Duka application has been successfully migrated from Microsoft Azure to **100% free services** with no cost lock-in.

## What Changed

### Before (Azure)
- Frontend: Azure Static Web Apps
- Backend: Azure App Service
- Database: Azure Cosmos DB
- File Storage: Azure Blob Storage

### After (Free Alternatives)
- Frontend: **Vercel**
- Backend: **Vercel / Railway.app**
- Database: **MongoDB Atlas (free tier)**
- File Storage: **Uploadthing (free tier)**

---

## Step-by-Step Setup

### 1. MongoDB Atlas Setup (Database)

**Why?** Free tier offers 512MB storage, perfect for MVP/testing.

**Steps:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Create a new account" or sign in
3. Create a new organization and project
4. Click "Create a Deployment" → Select **M0 (Free)**
5. Choose cloud provider (AWS, Google Cloud, or Azure) and region
6. Create a cluster
7. Wait 2-5 minutes for cluster to be created
8. Go to "Database Access" → Add New Database User
   - Username: `smartduka_user`
   - Password: Generate a strong password
   - Database User Privileges: Read and write to any database
9. Go to "Network Access" → Add IP Address → Allow from Anywhere (0.0.0.0/0)
10. Click "Connect" on your cluster
11. Choose "Drivers" and copy the connection string
12. Replace `<password>` with your user password
13. Add to your `.env` file:
    ```
    MONGODB_URI=mongodb+srv://smartduka_user:<password>@cluster0.xxxxx.mongodb.net/smartduka?retryWrites=true&w=majority
    ```

**Connection String Example:**
```
mongodb+srv://smartduka_user:MyStrongPassword123@cluster0.abcdef.mongodb.net/smartduka?retryWrites=true&w=majority
```

---

### 2. Uploadthing Setup (File Uploads)

**Why?** Free tier offers 32GB/month, better than Azure Blob Storage.

**Steps:**
1. Go to https://uploadthing.com
2. Click "Sign in" or create account with GitHub
3. Create a new app
4. Go to API Keys section
5. Copy your:
   - `UPLOADTHING_SECRET` (starts with `sk_live_`)
   - `UPLOADTHING_APP_ID` (starts with `xxxxxxxx`)
6. Add to your `.env` file:
    ```
    UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxx
    UPLOADTHING_APP_ID=xxxxxxxxxxxxxxxx
    ```

---

### 3. Vercel Setup (Frontend & Backend Deployment)

#### Option A: Deploy Frontend on Vercel (Recommended)

**Steps:**
1. Go to https://vercel.com
2. Click "Sign Up" (with GitHub account recommended)
3. Connect your GitHub repository
4. Select the repository containing Smart Duka
5. Configure project:
   - Framework: **Vite**
   - Root directory: **./client**
   - Build command: `npm run build`
   - Output directory: `.vite/dist`
6. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url/api
   ```
7. Click Deploy

**Result:** Your frontend is now live at `https://your-app.vercel.app`

#### Option B: Deploy Backend on Vercel (Node.js)

**For API Routes (Serverless Functions):**

1. Create `api/` folder in root directory
2. Vercel will automatically turn files in `api/` into serverless functions
3. Deploy the same way as frontend

**Alternative: Use Railway.app for Traditional Deployment**

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Configure:
   - Root: `/server`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
6. Add environment variables
7. Deploy

---

### 4. Paystack Setup (Payment Gateway)

**Steps:**
1. Go to https://paystack.com
2. Create account or sign in
3. Go to Settings → API Keys & Webhooks
4. Copy your:
   - Secret Key: `sk_live_xxxxxxxxxxxx` or `sk_test_xxxxxxxxxxxx`
   - Public Key: `pk_live_xxxxxxxxxxxx` or `pk_test_xxxxxxxxxxxx`
5. Add to `.env` file:
    ```
    PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxx
    PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
    ```

---

## Code Changes Summary

### Dependencies Changed

**Removed:**
- `@azure/storage-blob`

**Added:**
- `uploadthing`
- `@uploadthing/react` (client)

### Files Modified

1. **server/src/config/env.ts**
   - Removed: `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER_NAME`
   - Added: `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`

2. **server/src/utils/uploadthing.ts** (NEW)
   - Uploadthing server configuration
   - Product image upload router

3. **server/src/controllers/product.controller.ts**
   - Added `uploadProductImage()` function

4. **server/src/routes/product.routes.ts**
   - Added POST `/api/products/upload` endpoint

5. **.env.example**
   - Updated with new free service configurations

6. **README.md**
   - Updated deployment strategy section
   - Removed Azure references
   - Added Vercel, MongoDB Atlas, Uploadthing

---

## Local Development Setup

### 1. Install Dependencies

```bash
# Root directory
npm install

# Server
cd server
npm install

# Client
cd client
npm install
```

### 2. Create `.env` File

Copy from `.env.example`:
```bash
cp .env.example .env
```

Fill in your values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://smartduka_user:<password>@cluster0.xxxxx.mongodb.net/smartduka
JWT_SECRET=your-super-secret-jwt-key-change-this
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Server

```bash
# From root directory
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Uploadthing account created and API keys obtained
- [ ] Paystack account created and keys obtained (test keys first)
- [ ] GitHub repository set up and all changes pushed
- [ ] Vercel account created and GitHub connected
- [ ] Frontend deployed on Vercel with environment variables
- [ ] Backend deployed on Railway.app or Vercel with environment variables
- [ ] Environment variables updated in deployment platform
- [ ] Test product upload with Uploadthing
- [ ] Test payment flow with Paystack test keys
- [ ] Switch to production keys (Paystack, Uploadthing)

---

## Free Tier Limits

| Service | Limit | Details |
| ------- | ----- | ------- |
| MongoDB Atlas | 512MB | Enough for MVP/testing with ~10k products |
| Uploadthing | 32GB/month | Plenty for image uploads, ~5000 product images |
| Vercel | 100GB bandwidth/month | Sufficient for most traffic |
| Paystack | Pay per transaction | ~1.5% + ₦100 per successful transaction (Nigeria) |

**Recommendation:** Start with free tiers, upgrade only when you hit limits or need advanced features.

---

## Troubleshooting

### MongoDB Connection Error
- Check username/password in connection string
- Verify IP address is whitelisted (0.0.0.0/0)
- Ensure cluster is running (check MongoDB Atlas dashboard)

### Uploadthing Upload Fails
- Verify API keys are correct and in `.env`
- Check file size (max 4MB for product images)
- Ensure CORS is configured properly

### Backend Not Running
- Check `.env` is in correct directory (`/server/.env`)
- Run `npm install` again
- Check for TypeScript errors: `npm run build`

### Vercel Deployment Fails
- Check build logs in Vercel dashboard
- Ensure environment variables are set in Vercel
- Verify `package.json` build command is correct

---

## Cost Comparison

### Azure (Original)
- Static Web Apps: $0-$10/month
- App Service: $10-50/month
- Cosmos DB: $20-100+/month
- Blob Storage: $0.50-5/month
- **Estimated Monthly: $30-165/month** (scalable)

### Free Alternatives (New)
- Vercel: $0 (free tier)
- MongoDB Atlas: $0 (free tier)
- Uploadthing: $0 (free tier)
- Paystack: Pay per transaction only
- **Estimated Monthly: $0** (until you scale)

**Savings: $30-165/month initially!**

---

## Next Steps

1. **Test Locally:** Run `npm run dev` and verify everything works
2. **Push to GitHub:** Commit all changes and push
3. **Deploy Frontend:** Connect GitHub to Vercel and deploy
4. **Deploy Backend:** Push to Railway.app or Vercel API routes
5. **Test Production:** Visit your Vercel app and test workflows
6. **Monitor:** Use Vercel and MongoDB Atlas dashboards to monitor

---

## Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Uploadthing Docs](https://docs.uploadthing.com)
- [Railway.app Docs](https://docs.railway.app)
- [Paystack Docs](https://paystack.com/docs)

---

## Questions or Issues?

Refer to the official documentation of each service or check the README.md for more details.
