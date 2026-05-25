How the live Frontend and Backend communicate — Smart Duka

High-level overview

- Frontend Application: https://the-smart-duka.vercel.app
- Backend REST API: https://smart-duka-backend.vercel.app

Primary communication paths

1) API calls (REST)
   - The frontend issues HTTP requests to the backend API (endpoints under `/api/*`).
   - Example request path: `https://smart-duka-backend.vercel.app/api/products`.
   - Requests include JSON bodies and are handled by Express routes in `server/src/routes`.

2) Authentication (JWT)
   - User logs in via `/api/auth/login`.
   - Backend returns a JWT signed with `JWT_SECRET`.
   - Frontend stores the token in `localStorage` and the `api` axios instance attaches the header `Authorization: Bearer <token>` on each request.
   - The backend middleware `authenticate` reads the header, verifies the token, and attaches `req.user`.

3) CORS
   - The backend enables CORS with `cors({ origin: env.CLIENT_URL, credentials: true })`.
   - `CLIENT_URL` must be set to `https://the-smart-duka.vercel.app` in production so browser requests are allowed.

4) File uploads (Uploadthing)
   - The project integrates Uploadthing for uploads. Typical flows:
     - The frontend uses `@uploadthing/react` to upload files directly to Uploadthing.
     - Uploadthing calls the server-side `onUploadComplete` handlers (defined in `server/src/utils/uploadthing.ts`) so the backend can persist file metadata or link uploads to products/users.

5) Payments & webhooks
   - The frontend starts payment flows and the Paystack payment gateway handles checkout. The payment verification endpoint (`/api/payments/verify`) validates transactions server-side with Paystack.

Deployment-specific detail: client-side base URL

- In the local codebase, the client has been configured to read `import.meta.env.VITE_API_BASE` for the backend URL.
- On Vercel, the frontend project's `VITE_API_BASE` environment variable is configured to `https://smart-duka-backend.vercel.app/api`.

Security and best-practices notes

- Ensure `JWT_SECRET` is strong and kept private.
- Use HTTPS (enforced by Vercel by default) for both frontend and backend communication.
- Limit `MONGODB_URI` database access permissions.
- Validate file types/sizes in the Uploadthing file router schema.