# Free Deployment Quick Reference

## TL;DR - Setup in 10 Minutes

### 1. Database - MongoDB Atlas
- Sign up: https://mongodb.com/cloud/atlas
- Create M0 cluster (free)
- Copy connection string
- Add to `.env`: `MONGODB_URI=mongodb+srv://...`

### 2. File Uploads - Uploadthing
- Sign up: https://uploadthing.com
- Create app and copy API keys
- Add to `.env`:
  ```
  UPLOADTHING_SECRET=sk_live_...
  UPLOADTHING_APP_ID=...
  ```

### 3. Deploy Frontend - Vercel
- Go to: https://vercel.com
- Connect GitHub repo
- Deploy (auto-deploys on git push)

### 4. Deploy Backend - Vercel
- Go to: https://vercel.com
- Create a second project from the same GitHub repo
- Set Root Directory to `server`
- Add backend environment variables
- Test `/api/health` after deploy

## Services & Links

| Service | URL | Free Tier |
|---------|-----|-----------|
| MongoDB | https://mongodb.com/cloud/atlas | 512MB |
| Uploadthing | https://uploadthing.com | 32GB/month |
| Vercel | https://vercel.com | 100GB bandwidth/month |
| Railway | https://railway.app | $5/month credit |
| Paystack | https://paystack.com | Pay per transaction |

## Environment Variables Needed

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
CLIENT_URL=https://your-vercel-app.vercel.app
```

## Cost: $0/month (until you scale!)

No Azure subscription needed. All services have generous free tiers.
