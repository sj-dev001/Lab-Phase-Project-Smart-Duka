How the live Frontend and Backend communicate — Smart Duka

High-level overview

- Frontend: https://the.smart-duka.vercel.app
- Backend: https://smart-duka-backend.vercel.app

Primary communication paths

1) API calls (REST)
   - The frontend issues HTTP requests to the backend API (endpoints under `/api/*`).
   - Example request path: `https://smart-duka-backend.vercel.app/api/products`.
   - Requests include JSON bodies and are handled by Express routes in `server/src/routes`.

2) Authentication (JWT)
   - User logs in via `/api/auth/login`.
   - Backend returns a JWT signed with `JWT_SECRET`.
   - Frontend stores the token (the app uses `localStorage`) and the `api` axios instance attaches the header `Authorization: Bearer <token>` on each request.
   - The backend middleware `authenticate` reads the header, verifies the token, and attaches `req.user`.

3) CORS
   - The backend enables CORS with `cors({ origin: env.CLIENT_URL, credentials: true })`.
   - `CLIENT_URL` must be `https://the.smart-duka.vercel.app` in production so browser requests are allowed.

4) File uploads (Uploadthing)
   - The project integrates Uploadthing for uploads. Typical flows:
     - The frontend uses `@uploadthing/react` to upload files directly to Uploadthing.
     - Uploadthing calls the server-side `onUploadComplete` handlers (defined in `server/src/utils/uploadthing.ts`) so the backend can persist file metadata or link uploads to products/users.
   - Alternatively, you can have the frontend request a signed upload URL from the backend and then upload directly to the storage provider; Uploadthing abstracts this and handles the signature flow for you.

5) Payments & webhooks
   - If using Paystack (or any payment provider), the frontend starts payment flows and the provider sends server-side webhooks to your backend to confirm transactions. Webhook endpoints must be public and secured (verify signatures).

Deployment-specific detail: client-side base URL

- In the local codebase `client/src/services/api.ts` the API base is currently `'/api'` (a relative path). That works if the frontend and backend are served from the same origin or if you configure a proxy/rewrite on Vercel.
- Since your frontend and backend are on different origins, pick one of these options:
  - Configure the frontend to use the absolute backend URL by setting a Vite env `VITE_API_BASE=https://smart-duka-backend.vercel.app/api` and update `API_BASE` in `client/src/services/api.ts` to `import.meta.env.VITE_API_BASE || '/api'`.
  - Or add a Vercel rewrite rule in the frontend project to proxy `/api/*` to `https://smart-duka-backend.vercel.app/api/*` (keeps client code unchanged).

Security and best-practices notes

- Ensure `JWT_SECRET` is strong and kept private.
- Use HTTPS (Vercel does by default) for both frontend and backend.
- Limit `MONGODB_URI` user privileges to only required DB actions.
- For Uploadthing or any upload provider, validate file types/sizes in backend `onUploadComplete` before creating product records.

If you'd like, I can modify `client/src/services/api.ts` to read `VITE_API_BASE` (and add a short snippet showing how to set that in Vercel). Which option do you want: rewrite on Vercel or change the client to use `VITE_API_BASE`?