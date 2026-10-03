<<<<<<< HEAD
# COLABMATCH

> Find Your Perfect Project Collaborators

COLABMATCH is a full-stack web application for final-year students to find project collaborators. Students can create profiles, list their skills, create/join projects, discover suitable matches, and manage teams.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Icons | Google Material Symbols |

## Project Structure

```
COLABMATCH/
├── client/          # React frontend
├── server/          # Express.js backend
├── database/        # SQL migrations
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `database/migration.sql`
3. Copy your project URL, anon key, service role key, and JWT secret from Settings > API

### 2. Configure environment variables

```bash
# Client
cp client/.env.example client/.env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# Server
cp server/.env.example server/.env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET
```

### 3. Install dependencies

```bash
# Client
cd client && npm install

# Server
cd server && npm install
```

### 4. Run in development

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Features

- **Authentication** — Sign up, login, logout, protected routes
- **Student Profiles** — Skills, bio, college, experience level, GitHub/LinkedIn
- **Projects** — Create, edit, delete, search, filter by category/status/skills
- **Collaboration** — Join requests, accept/reject, team management
- **Matching** — Skill-based compatibility percentage algorithm
- **Dashboard** — Overview of projects, requests, recommendations

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/profiles/me` | Current user profile |
| PUT | `/api/profiles/me` | Update profile |
| PUT | `/api/profiles/me/skills` | Set skills |
| GET | `/api/profiles/:id` | Public profile |
| GET | `/api/skills` | All skills |
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | List projects |
| GET | `/api/projects/:id` | Project details |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/join` | Request to join |
| GET | `/api/projects/:id/requests` | Join requests |
| PUT | `/api/requests/:id` | Accept/reject |
| GET | `/api/match/projects` | Recommended projects |
| GET | `/api/match/collaborators/:id` | Recommended collaborators |
| GET | `/api/dashboard` | Dashboard data |
=======
# ColabMatch
>>>>>>> 26602573f1efc23c2baa30df6e519c8befc485b2
