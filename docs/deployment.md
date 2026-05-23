Deployment notes — Smart Duka

Hosted apps

- Backend: https://smart-duka-backend.vercel.app/
- Frontend: https://the.smart-duka.vercel.app/

Required environment variables

Server (Vercel project for backend):
- `MONGODB_URI` — MongoDB Atlas connection string (example: `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/smartduka?retryWrites=true&w=majority`).
- `JWT_SECRET` — secret used to sign JWTs.
- `UPLOADTHING_SECRET` — secret/key from Uploadthing service (or your chosen upload provider).
- `UPLOADTHING_APP_ID` — Uploadthing app id (if used).
- `CLIENT_URL` — set to `https://the.smart-duka.vercel.app` so CORS allows the frontend.
- `NODE_ENV` — `production`.

Frontend (Vercel project for frontend):
- Recommended: Use a Vite environment variable `VITE_API_BASE` set to `https://smart-duka-backend.vercel.app/api` and update `client/src/services/api.ts` to read it (the project now uses this approach).

How to set `VITE_API_BASE`:
- Locally: create `client/.env.local` (or `client/.env`) with:

```
VITE_API_BASE=https://smart-duka-backend.vercel.app/api
```

- In Vercel (web): go to Project → Settings → Environment Variables and add `VITE_API_BASE` with value `https://smart-duka-backend.vercel.app/api` for `Preview` and `Production`, then redeploy.
- In Vercel (CLI):

```bash
vercel env add VITE_API_BASE production
# when prompted paste: https://smart-duka-backend.vercel.app/api
vercel env add VITE_API_BASE preview
```

Notes: After setting the env, redeploy the frontend. The client now resolves `API_BASE` from `import.meta.env.VITE_API_BASE || '/api'`, so it will use the backend URL in production and `/api` locally if the env is unset.
Upload handling

- This project uses Uploadthing for file storage in the new migration. Create an Uploadthing app and set `UPLOADTHING_APP_ID` and `UPLOADTHING_SECRET` in the backend project settings.
- The client uses `@uploadthing/react` to perform uploads; the server uses `uploadthing/express` to define upload handlers and `onUploadComplete` logic.

MongoDB Atlas

- Create a free Atlas cluster and a database user. Put the connection URI into `MONGODB_URI` in the backend settings.
- Whitelist Vercel IPs is not necessary — Atlas uses access via username/password and network access controls; allow access from 0.0.0.0/0 for quick testing (not recommended for production).

Vercel notes

- Create two projects in Vercel: one for `server` (Node/Express) and one for `client` (Vite/React). Alternatively, keep the backend as a Vercel Serverless Function project.
- For the backend project, set the build command: `npm run build` (if you compile) and start/serve as appropriate; Vercel may auto-detect Node.
- Ensure environment variables are set in the Vercel dashboard for each project.

Quick checklist to go live

1. Create MongoDB Atlas cluster and user. Copy `MONGODB_URI`.
2. Create Uploadthing app, copy `UPLOADTHING_APP_ID` and `UPLOADTHING_SECRET`.
3. Create Vercel project for backend and set env vars (server).
4. Create Vercel project for frontend and set `VITE_API_BASE` (or configure rewrite).
5. Deploy backend to Vercel; confirm `https://smart-duka-backend.vercel.app/api/health` returns OK.
6. Deploy frontend to Vercel; load `https://the.smart-duka.vercel.app/` and test features.

If you want, I can create a PR that changes `client/src/services/api.ts` to use `import.meta.env.VITE_API_BASE` instead of the current `'/api'` and add `README` notes — tell me whether you prefer rewriting on Vercel or updating the client code.
