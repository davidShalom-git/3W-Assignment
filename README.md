# Mini Social Post App

A small social feed app — signup/login, create posts with text and/or an image, like and comment on posts. Built for the 3W full stack internship assignment, UI inspired by the TaskPlanet social page.

## Stack

- Frontend: React (Vite) + MUI
- Backend: Node.js + Express
- Database: MongoDB (2 collections: `users`, `posts`)
- Image storage: Cloudinary
- Auth: JWT

## Folder structure

```
backend/    Express API (auth, posts, likes, comments)
frontend/   React app
```

## Running it locally

You'll need a MongoDB connection string (Atlas or local) and a Cloudinary account (free tier is fine).

### Backend

```
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, CLOUDINARY_* keys
npm run dev
```

Runs on `http://localhost:5000`. `npm test` runs the unit tests (password hashing, pagination cursor logic, like toggle).

### Frontend

```
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm run dev
```

Runs on `http://localhost:5173`.

## API

| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/signup` | - | username, email, password |
| POST | `/api/auth/login` | - | email, password |
| GET | `/api/posts?cursor=&limit=` | - | public feed, cursor-paginated |
| GET | `/api/posts/:id` | - | single post + comments |
| POST | `/api/posts` | yes | multipart form, `text` and/or `image`, at least one required |
| POST | `/api/posts/:id/like` | yes | toggles like |
| POST | `/api/posts/:id/comment` | yes | body: `text` |

Feed pagination uses the post `_id` as a cursor instead of skip/limit, so paging deep into the feed stays cheap (indexed range query instead of Mongo walking past every skipped document).

## Deploying

**MongoDB Atlas** — create a free cluster, add a database user, allow access from anywhere (0.0.0.0/0) under Network Access, copy the connection string.

**Cloudinary** — sign up free, grab Cloud Name / API Key / API Secret from the dashboard.

**Backend on Render**
1. New Web Service, point it at the `backend` folder of this repo.
2. Build command `npm install`, start command `npm start`.
3. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL, set after the frontend is deployed), `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
4. A `render.yaml` is included if you want to use Render's Blueprint deploy instead.

**Frontend on Vercel**
1. New Project, point it at the `frontend` folder.
2. Framework preset: Vite.
3. Env var: `VITE_API_URL` = your Render backend URL.
4. `vercel.json` is included so client-side routing (e.g. `/post/:id`) doesn't 404 on refresh.

After both are live, update `CLIENT_URL` on Render to the real Vercel URL and redeploy the backend (it's used for CORS).
