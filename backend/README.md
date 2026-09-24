# CivicResolve Backend API

Full-featured Node.js, Express, and MongoDB backend for the CivicResolve civic issue tracking platform.

---

## 🗄️ Database Setup (MongoDB Compass & MongoDB Atlas)

### 1. Using MongoDB Compass (Local Development - Current Default)
1. Download & Open **MongoDB Compass** on your computer.
2. In the connection dialog, connect to the standard local URI:
   ```
   mongodb://127.0.0.1:27017
   ```
   *(or `mongodb://localhost:27017`)*
3. When the backend or seed script runs, it will automatically create and populate the **`civic_resolve`** database in MongoDB Compass with collections:
   - `users`
   - `issues`
   - `departments`
   - `notifications`

### 2. Switching to MongoDB Atlas (Cloud Database - Future Ready)
Whenever you are ready to switch to MongoDB Atlas:
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Cluster (Free M0 or higher).
3. Under **Security** -> **Database Access**, create a user (username & password).
4. Under **Network Access**, add your current IP address (or `0.0.0.0/0` for access from anywhere).
5. Click **Connect** -> **Drivers** (Node.js) and copy the connection string.
6. Open `backend/.env` and update `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/civic_resolve?retryWrites=true&w=majority
   ```
7. Restart the backend server. That's it!

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Seed Database (Populate Initial Data & Test Accounts)
```bash
npm run seed
```

### 3. Start Backend Server
- **Development (with hot-reload):**
  ```bash
  npm run dev
  ```
- **Production:**
  ```bash
  npm start
  ```
Server will be active at: `http://localhost:5000`

---

## 🔑 Default Seeded Accounts (Password for all: `password123`)

| Role | Email | Password | Access / Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` | Full system control, all issues, users, departments |
| **Officer** | `officer@example.com` | `password123` | Officer tasks, status updates, map view |
| **Citizen** | `citizen@example.com` | `password123` | Report issue, track reports, profile |

---

## 📡 REST API Documentation

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a citizen / user
- `POST /api/auth/login` - Login and obtain JWT token
- `GET /api/auth/me` - Get current authenticated user profile
- `PUT /api/auth/profile` - Update user name, phone, preferences
- `PUT /api/auth/change-password` - Change account password

### 📋 Issues / Reports (`/api/issues`)
- `GET /api/issues` - List all issues (filters: `status`, `category`, `priority`, `search`, `department`)
- `GET /api/issues/my` - List issues reported by logged-in citizen
- `GET /api/issues/assigned` - List issues assigned to logged-in officer
- `GET /api/issues/:id` - Get single issue details by ID or `issueId` (e.g. `ISS-1001`)
- `POST /api/issues` - Report a new civic issue (supports multipart/form-data for image uploads)
- `PUT /api/issues/:id` - Update status, priority, assignment & activity log
- `DELETE /api/issues/:id` - Delete issue (Admin only)

### 👥 User Management (`/api/users`)
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/officers` - Get active officers list
- `POST /api/users` - Create user with specific role (Admin only)
- `PUT /api/users/:id` - Update user role, department, status (Admin only)
- `DELETE /api/users/:id` - Remove user (Admin only)

### 🏢 Departments (`/api/departments`)
- `GET /api/departments` - List departments with dynamic staff and open issue metrics
- `POST /api/departments` - Create a department (Admin only)
- `PUT /api/departments/:id` - Update department (Admin only)
- `DELETE /api/departments/:id` - Remove department (Admin only)

### 📊 Analytics & Stats (`/api/stats`)
- `GET /api/stats/overview` - System metrics, category distribution, resolution trend datasets

### 📷 Uploads (`/api/upload`)
- `POST /api/upload` - Upload image attachment
