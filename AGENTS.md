# Booking System - Agent Instructions

## Architecture

Monorepo with two packages:
- **backend/** - Laravel 13 (PHP 8.3), API at `http://localhost:8000`
- **frontend/** - React 19 + TypeScript + Vite, dev server at `http://localhost:5173`

Root uses **pnpm** workspaces. Docker Compose runs MySQL + backend.

## Developer Commands

### Root (from `/home/jpvrcm/Documents/booking-system`)
```bash
pnpm dev              # Frontend dev server only
pnpm dev:all          # Start docker (MySQL+backend) + frontend dev server
pnpm docker:up        # Start MySQL + backend containers
pnpm docker:down      # Stop containers
pnpm docker:logs      # Follow docker logs
pnpm backend:shell    # Bash shell inside the backend container
pnpm php:artisan      # Run `php artisan` inside backend container
pnpm php:migrate      # Run migrations
pnpm php:seed         # Run database seeder
pnpm php:fresh        # Fresh migrate (drop + migrate)
pnpm php:composer     # Run composer inside backend container
pnpm php:routes       # List API routes
pnpm php:test         # Run backend tests inside container
pnpm test             # Run backend tests (alias of php:test)
```

### Backend (from `backend/`)
```bash
composer install      # Install PHP deps
cp .env.example .env  # Configure env (first time)
php artisan key:generate
php artisan migrate   # Run migrations
npm install           # Install JS deps (Vite)
npm run dev           # Vite dev server (assets)
# OR: composer dev    # Runs php artisan dev (Laravel dev server)
```

### Frontend (from `frontend/`)
```bash
pnpm dev              # Vite dev server
pnpm build            # TypeScript + Vite build
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm format           # Prettier
```

## Environment

- Backend `.env` uses **SQLite** by default (file: `database/database.sqlite`)
- Docker Compose overrides to **MySQL** (`mysql:3306`, db: `booking_db`)
- Frontend calls API at `http://localhost:8000/api` (see `frontend/src/App.tsx:8`)
- Backend API routes in `backend/routes/api.php`

## Testing

- Backend: `composer test` (runs `php artisan test` via PHPUnit)
- Frontend: No test config yet

## Key Conventions

- Backend follows Laravel 13 structure (routes in `routes/`, models in `app/Models/`)
- Frontend uses path alias `@` → `src/` (see `vite.config.ts`)
- Tailwind CSS v4 via Vite plugin in both packages
- shadcn/ui components in `frontend/src/components/ui/`

## Gotchas

- Backend `npm run dev` only compiles assets; use `composer dev` for Laravel server
- Docker Compose mounts `./backend` → `/var/www/html` (hot reload works)
- Frontend expects backend at `localhost:8000`; CORS configured in `backend/config/cors.php`
- Run `pnpm docker:up` before `pnpm dev` (or use `pnpm dev:all`) for full stack