# TaskFlow — Task Management System

A full-stack task management application built with **Node.js + TypeScript** backend and **Next.js** frontend.

---

## Tech Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Backend     | Node.js, Express, TypeScript          |
| ORM         | Prisma                                |
| Database    | MySQL                                 |
| Auth        | JWT (Access + Refresh Tokens), bcrypt |
| Frontend    | Next.js 14 (App Router), TypeScript   |
| Styling     | Tailwind CSS                          |
| State       | Zustand                               |
| Forms       | React Hook Form                       |
| HTTP Client | Axios (with auto token refresh)       |

---

## Project Structure

```
task-management/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts # Register, Login, Refresh, Logout
│   │   │   └── task.controller.ts # CRUD + Toggle + Pagination
│   │   ├── lib/
│   │   │   ├── prisma.ts          # Prisma client singleton
│   │   │   └── jwt.ts             # Token generation & verification
│   │   ├── middleware/
│   │   │   ├── authenticate.ts    # JWT auth guard
│   │   │   ├── errorHandler.ts    # Global error handler
│   │   │   └── notFound.ts        # 404 handler
│   │   ├── routes/
│   │   │   ├── auth.routes.ts     # /auth/*
│   │   │   └── task.routes.ts     # /tasks/*
│   │   ├── app.ts                 # Express app setup
│   │   └── index.ts               # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   ├── login/page.tsx
    │   │   │   └── register/page.tsx
    │   │   ├── (dashboard)/
    │   │   │   ├── layout.tsx          # Sidebar layout
    │   │   │   └── dashboard/
    │   │   │       ├── page.tsx        # Stats overview
    │   │   │       └── tasks/page.tsx  # Task list + CRUD
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx               # Redirects to /dashboard
    │   ├── components/tasks/
    │   │   ├── Badges.tsx             # Status & Priority badges
    │   │   ├── TaskCard.tsx           # Individual task card
    │   │   ├── TaskFormModal.tsx      # Create/Edit modal
    │   │   └── DeleteConfirmModal.tsx # Delete confirmation
    │   ├── lib/
    │   │   ├── api.ts                 # Axios + auto token refresh
    │   │   ├── auth.ts                # Auth service functions
    │   │   └── tasks.ts               # Task service functions
    │   ├── store/
    │   │   └── authStore.ts           # Zustand auth state
    │   └── types/
    │       └── index.ts               # Shared TypeScript types
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## Setup Instructions

### Prerequisites

Make sure you have installed:

- **Node.js** v18 or higher
- **MySQL** running locally (or a remote MySQL instance)
- **npm** or **yarn**

---

### Step 1 — Clone & Install Dependencies

```bash
# Install backend dependencies
cd task-management/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Configure the Backend

```bash
cd task-management/backend

# Copy the example env file
cp .env.example .env
```

Now open `.env` and fill in your values:

```env
# Your MySQL connection string
DATABASE_URL="mysql://root:yourpassword@localhost:3306/task_management_db"

PORT=5000
NODE_ENV=development

# Change these to long random strings in production!
JWT_ACCESS_SECRET=your_super_secret_access_token_key
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

> **Tip:** You can generate strong secrets with:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

### Step 3 — Set Up the Database

Make sure MySQL is running and the database exists:

```sql
-- Run this in your MySQL client
CREATE DATABASE task_management_db;
```

Then run Prisma migrations:

```bash
cd task-management/backend

# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init
```

You should see output confirming the `users`, `tasks`, and `refresh_tokens` tables were created.

---

### Step 4 — Configure the Frontend

```bash
cd task-management/frontend

# Copy the example env file
cp .env.example .env.local
```

The default `.env.local` content:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

### Step 5 — Run the Application

Open **two terminal windows**:

**Terminal 1 — Backend:**

```bash
cd task-management/backend
npm run dev
```

You should see:

```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**

```bash
cd task-management/frontend
npm run dev
```

You should see:

```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

---

### Step 6 — Open the App

Visit **http://localhost:3000** in your browser.

- Register a new account
- Log in
- Start creating and managing tasks!

---

## API Endpoints

### Authentication

| Method | Endpoint         | Auth Required | Description              |
| ------ | ---------------- | :-----------: | ------------------------ |
| POST   | `/auth/register` |      ❌       | Register a new user      |
| POST   | `/auth/login`    |      ❌       | Login and get tokens     |
| POST   | `/auth/refresh`  |      ❌       | Get new access token     |
| POST   | `/auth/logout`   |      ❌       | Invalidate refresh token |

**Register / Login request body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Token response:**

```json
{
  "message": "Login successful",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

### Tasks

All task endpoints require the `Authorization: Bearer <accessToken>` header.

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| GET    | `/tasks`            | List tasks (paginated, filterable) |
| POST   | `/tasks`            | Create a new task                  |
| GET    | `/tasks/:id`        | Get a single task                  |
| PATCH  | `/tasks/:id`        | Update a task                      |
| DELETE | `/tasks/:id`        | Delete a task                      |
| POST   | `/tasks/:id/toggle` | Toggle task completion             |

**GET /tasks query parameters:**

| Param      | Type   | Example           | Description                           |
| ---------- | ------ | ----------------- | ------------------------------------- |
| `page`     | number | `?page=2`         | Page number (default: 1)              |
| `limit`    | number | `?limit=10`       | Items per page (default: 10, max: 50) |
| `status`   | string | `?status=PENDING` | Filter by status                      |
| `priority` | string | `?priority=HIGH`  | Filter by priority                    |
| `search`   | string | `?search=meeting` | Search by title                       |

**Create / Update task body:**

```json
{
  "title": "Finish the report",
  "description": "Write Q4 summary",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2025-01-31"
}
```

**Valid values:**

- `status`: `PENDING` | `IN_PROGRESS` | `COMPLETED`
- `priority`: `LOW` | `MEDIUM` | `HIGH`

---

## Features

### Backend

- ✅ JWT authentication with Access + Refresh token rotation
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Protected routes via middleware
- ✅ Input validation with express-validator
- ✅ Pagination, filtering by status/priority, title search
- ✅ Global error handling with proper HTTP status codes
- ✅ Prisma ORM with MySQL

### Frontend

- ✅ Login and Registration pages with form validation
- ✅ Automatic token refresh on 401 (via Axios interceptor)
- ✅ Dashboard with task stats overview
- ✅ Task list with grid layout, search, filter, pagination
- ✅ Create, Edit, Delete tasks via modals
- ✅ Toggle task completion status
- ✅ Toast notifications for all actions
- ✅ Responsive design (desktop + mobile)
- ✅ Zustand global auth state

---
