# 🔗 LinkSnap — URL Shortener

A production-grade URL shortener built with **FastAPI** (Python) + **Next.js** (TypeScript) + **SQL Server** + **Redis**.

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Next.js UI    │────▶│  FastAPI Backend  │────▶│  SQL Server  │
│  (Port 3000)    │     │   (Port 8000)     │     │  (Port 1433) │
└─────────────────┘     └────────┬─────────┘     └──────────────┘
                                 │
                        ┌────────▼─────────┐
                        │   Redis Cache    │
                        │   (Port 6379)    │
                        └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- OR: Python 3.12+, Node.js 18+, SQL Server, Redis

### Option 1: Docker Compose (Recommended)
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env         # Edit with your DB credentials
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/links` | Create a short link |
| `GET`  | `/{short_code}` | Redirect to original URL |
| `GET`  | `/api/v1/health` | Health check |

### Create Short Link
```bash
curl -X POST http://localhost:8000/api/v1/links \
  -H "Content-Type: application/json" \
  -d '{"long_url": "https://example.com/very/long/url"}'
```

**Response:**
```json
{
  "short_code": "xK7pQ3m",
  "short_url": "http://localhost:8000/xK7pQ3m",
  "long_url": "https://example.com/very/long/url",
  "created_at": "2026-07-26T10:15:00Z"
}
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript |
| Backend | FastAPI + Python 3.12 |
| Database | Microsoft SQL Server 2022 |
| Cache | Redis 7 |
| ID Generation | Snowflake-style + Base62 |

## 📐 Design Decisions

- **Snowflake ID + Base62**: Collision-free short codes without per-write DB checks
- **Cache-aside (Redis)**: Only caches actively-read links; degrades gracefully
- **HTTP 302 redirects**: Preserves click analytics + allows destination changes
- **Async analytics**: Click recording never blocks the redirect path

## 📂 Project Structure

```
├── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── redis_client.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── routers/
│   │   └── utils/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   ├── lib/
│   └── Dockerfile
└── README.md
```

## 📋 Roadmap

- [x] **Phase 1** — MVP: Create link, redirect, Redis cache, Next.js UI
- [ ] **Phase 2** — Auth (JWT), CRUD management, rate limiting, vanity aliases
- [ ] **Phase 3** — Analytics dashboard, message queue, read replicas
- [ ] **Phase 4** — DB sharding, multi-region (when metrics justify it)

## 📄 License

MIT
