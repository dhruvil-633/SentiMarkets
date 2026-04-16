# SentiMarket Deployment Guide (Free + Simple)

This guide deploys:
- Frontend: Vercel (free)
- Backend: Render (free) or Railway (free trial/credits)
- Database: Neon PostgreSQL (free, preferred)

## 1) Backend Changes Applied

- SQLite now switches to PostgreSQL automatically when `DATABASE_URL` is set.
- `.env` loading is enabled for local and deployed environments.
- CORS now reads `FRONTEND_URL` (single URL or comma-separated URLs).
- SQLAlchemy supports `postgresql://...` and normalizes `postgres://...` if needed.
- `psycopg2-binary` added for PostgreSQL driver support.

## 2) Frontend Changes Applied

- API base URL is now env-based via `VITE_API_URL`.
- No hardcoded API localhost target in app source.
- Example env file added for deployment.

## 3) Neon PostgreSQL Setup

1. Create account at Neon.
2. Create a new project and database.
3. Copy connection string:
   - Format: `postgresql://user:password@host/dbname?sslmode=require`
4. Add it to backend env as `DATABASE_URL`.

Note:
- This backend auto-creates SQL tables on startup via SQLAlchemy `create_all()`.
- No Alembic migration step is required for first deploy.

## 4) Deploy Backend (Render - Recommended)

1. Push this repo to GitHub.
2. In Render: **New +** -> **Web Service**.
3. Connect your GitHub repo.
4. Configure:
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add Environment Variables:
   - `DATABASE_URL` = your Neon connection string
   - `JWT_SECRET` = long random string
   - `FRONTEND_URL` = your Vercel URL (for example `https://your-app.vercel.app`)
6. Deploy and confirm health endpoint:
   - `https://your-backend-url.onrender.com/health`

Railway alternative:
- Same env variables.
- Start command can be the same.
- Set root to `backend`.

## 5) Deploy Frontend (Vercel)

1. In Vercel: **Add New** -> **Project**.
2. Import the same GitHub repo.
3. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = your backend URL (for example `https://your-backend-url.onrender.com`)
5. Deploy.
6. Copy Vercel domain and update backend `FRONTEND_URL` with that exact URL.

## 6) Required Environment Variables

Backend:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=https://your-frontend.vercel.app
```

Frontend:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## 7) Common Errors and Fixes

1. `CORS error in browser`
   - Fix: Ensure backend `FRONTEND_URL` exactly matches your Vercel URL including `https://`.

2. `sqlalchemy.exc.NoSuchModuleError: Can't load plugin: sqlalchemy.dialects:postgres`
   - Fix: confirm `psycopg2-binary` is in `requirements.txt` and redeploy backend.

3. `connection refused` from frontend
   - Fix: verify `VITE_API_URL` points to deployed backend (not localhost), then redeploy frontend.

4. `password authentication failed for user`
   - Fix: check `DATABASE_URL` value in Render/Railway; paste full Neon connection string again.

5. `Render service sleeps on free tier`
   - Fix: first request may be slow (cold start). Keep `/health` endpoint for warm-up checks.

## 8) Final Architecture

```text
Browser (User)
   |
   v
Vercel (React + Vite static site)
   |
   v
Render/Railway (FastAPI app via Uvicorn)
   |
   v
Neon PostgreSQL (managed free DB)
```

## 9) Latency + Cold Start Tips (Free-Tier Friendly)

- Keep backend and database in the same region (for example both in nearest available region).
- Keep payloads small and avoid heavy startup work.
- Use `/health` endpoint to quickly detect cold starts.

## 10) Simple Scaling Path (Optional Paid Upgrade)

- Render/Railway: move to always-on plan to remove cold starts.
- Neon/Supabase: upgrade compute for faster DB response.
- Add Redis cache later if read traffic grows.
