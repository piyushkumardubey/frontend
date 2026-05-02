# Project Manager UI

A modern, role-based project management frontend built with **React + Vite**. It connects to the [Project Manager API](https://github.com/your-repo/project-manager-api) (Spring Boot + JWT) and lets teams create projects, manage tasks on a Kanban board, and collaborate with role-based access control.

---

## Screenshots

> Dashboard · Projects · Kanban Board · My Tasks

---

## Features

- **Authentication** — JWT-based login & signup with persistent sessions via localStorage
- **Dashboard** — Task stats (To Do / In Progress / Done / Overdue), overdue task alerts, and recent projects at a glance
- **Projects** — Create, edit, and delete projects; browse all projects you're a member of
- **Kanban Board** — Per-project board with To Do / In Progress / Done columns, status filters, and inline task management
- **My Tasks** — All tasks assigned to you, with search and filter by status or overdue
- **Member Management** — Add/remove project members by email, assign Admin or Member roles
- **Role-Based Access** — Only project owners/admins can create tasks, edit projects, or manage members
- **Toast Notifications** — Success/error feedback on every action
- **Responsive Layout** — Sidebar navigation with a clean dark-themed UI

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | React | 18.2 |
| Build Tool | Vite | 5.1 |
| Routing | React Router DOM | 6.22 |
| HTTP Client | Axios | 1.6 |
| Notifications | react-hot-toast | 2.4 |
| Date Formatting | date-fns | 3.3 |
| Containerization | Docker + Nginx | — |

---

## Project Structure

```
src/
├── api/                  # Axios instance + API modules
│   ├── axios.js          # Base client with JWT interceptor & 401 redirect
│   ├── authApi.js        # login, signup
│   ├── projectApi.js     # CRUD + member management
│   ├── taskApi.js        # CRUD + stats + overdue
│   └── userApi.js        # User lookup
├── components/
│   ├── layout/           # AppLayout, Navbar (sidebar)
│   ├── ui/               # Modal, Spinner, StatusBadge
│   ├── ProjectCard.jsx
│   ├── TaskCard.jsx
│   ├── TaskForm.jsx
│   └── MemberList.jsx
├── context/
│   └── AuthContext.jsx   # Global auth state (user, login, signup, logout)
├── hooks/
│   ├── useProjects.js    # Project list state & actions
│   └── useTasks.js       # Task list state & actions
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── ProjectDetail.jsx # Kanban board + Members tab
│   └── MyTasks.jsx
├── routes/
│   └── ProtectedRoute.jsx
├── App.jsx
└── main.jsx
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- The [Project Manager API](https://github.com/your-repo/project-manager-api) running on `http://localhost:8080`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/project-manager-ui.git
cd project-manager-ui

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set your API URL (see Environment Variables section)

# 4. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080/api
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the Project Manager API | `http://localhost:8080/api` |

> For production (e.g. Railway), set `VITE_API_URL` to your deployed backend URL.

---

## Available Scripts

```bash
npm run dev        # Start development server on port 5173
npm run build      # Build for production (outputs to /dist)
npm run preview    # Preview the production build locally
```

---

## Docker Deployment

The app uses a two-stage Docker build — Node to build, Nginx to serve.

### Build & Run Locally

```bash
docker build -t project-manager-ui .
docker run -p 80:80 project-manager-ui
```

### Deploy to Railway

1. Push your code to GitHub
2. In Railway, create a new service from your GitHub repo
3. Add the environment variable:
   ```
   VITE_API_URL=https://your-api.up.railway.app/api
   ```
4. Railway will auto-detect the Dockerfile and deploy

> **Note:** `VITE_` variables are embedded at **build time** by Vite. Make sure to set them before Railway runs `npm run build`, not just at runtime.

---

## API Integration

All HTTP calls go through `src/api/axios.js`, which:

- Sets the `baseURL` from `VITE_API_URL`
- Automatically attaches the JWT token from localStorage to every request as `Authorization: Bearer <token>`
- Globally intercepts `401` responses, clears auth state, and redirects to `/login`

### Endpoints Used

| Feature | Method | Endpoint |
|---|---|---|
| Sign up | POST | `/auth/signup` |
| Login | POST | `/auth/login` |
| Get all projects | GET | `/projects` |
| Create project | POST | `/projects` |
| Update project | PUT | `/projects/:id` |
| Delete project | DELETE | `/projects/:id` |
| Get project by ID | GET | `/projects/:id` |
| Add member | POST | `/projects/:id/members` |
| Remove member | DELETE | `/projects/:id/members/:userId` |
| Get tasks (project) | GET | `/tasks?projectId=:id` |
| Get my tasks | GET | `/tasks/my` |
| Create task | POST | `/tasks` |
| Update task | PUT | `/tasks/:id` |
| Update task status | PATCH | `/tasks/:id/status` |
| Delete task | DELETE | `/tasks/:id` |
| Get task stats | GET | `/tasks/stats` |
| Get overdue tasks | GET | `/tasks/overdue` |

---

## Authentication Flow

1. User submits login/signup form
2. API returns `{ token, id, name, email, role }`
3. Token and user object are saved to `localStorage`
4. `AuthContext` makes `user` and `isAdmin` available app-wide
5. `ProtectedRoute` redirects unauthenticated users to `/login`
6. On any `401` response, the interceptor auto-logs out and redirects to `/login`

---

## Roles & Permissions

| Action | Member | Admin / Owner |
|---|---|---|
| View projects & tasks | ✅ | ✅ |
| Create/edit/delete tasks | ❌ | ✅ |
| Create/edit/delete projects | ❌ | ✅ |
| Add/remove project members | ❌ | ✅ |
| Change task status | ✅ | ✅ |
