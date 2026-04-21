# AI Coding Agent Instructions - Cine Kandy Films Website

## Quick Start Overview
MERN full-stack site for premium photography/videography services. React frontend (port 3000) calls Express API (port 5000) backed by MongoDB. **Key design**: Cinematic gold (#C9A050)/navy (#1A1A2E) with Framer Motion animations. JWT-protected admin panel for managing gallery, blog, and contacts.

**Critical**: All backend code is in [backend/server.js](backend/server.js#L1) (single file), all models defined inline.

---

## Architecture

### Frontend (React 18 + React Router v6)
- **Router/Nav**: [App.js](frontend/src/App.js#L1) - `navLinks` array drives menu, `useLocation()` auto-closes mobile menu on route change
- **Pages** in [pages/](frontend/src/pages/): Home (hero + stats), Gallery (category filter, lightbox), Services, Blog/BlogPost, About, Contact, admin/
- **API calls**: All via `axios` to `http://localhost:5000/api/*`, token in `Authorization: Bearer <token>` header
- **Key animations**: `containerVariants` pattern for consistent page enters, `AnimatePresence` for exit animations

### Backend (Express + MongoDB)
- **Single file**: [server.js](backend/server.js#L1) contains all models (Admin, Gallery, Blog, Contact), routes, auth middleware
- **Upload path**: `backend/uploads/` (served statically at `/uploads/`)
- **Auth**: POST `/api/admin/login` returns JWT (7d expiry). Token stored in localStorage (frontend convention).

**Data Models**:
- Admin: username/email/hashedPassword
- Gallery: title/description/category/image/featured/createdAt (public readable)
- Blog: title/content/excerpt/image/category/author/published (only published=true returned to public)
- Contact: name/email/phone/message/status/createdAt

**API Pattern**:
- Public: `GET /api/gallery` (filters by `?category=wedding`), `GET /api/blog`, `POST /api/contact`
- Protected: `POST/PUT/DELETE /api/gallery`, `/api/blog` (require token + `authMiddleware`)
- Auth: `POST /api/admin/login`, `POST /api/admin/create` (disable in production)

---

## Developer Workflows

### Setup & Running
```bash
# Backend
cd backend && npm install && cp .env.example .env
# Edit .env: MONGODB_URI=mongodb://localhost:27017/cinekandy, JWT_SECRET=your_key
mkdir uploads && npm run dev  # starts on :5000, requires MongoDB running

# Frontend (separate terminal)
cd frontend && npm install && npm start  # starts on :3000
```

### Creating Admin User (first time)
Send POST to `http://localhost:5000/api/admin/create`:
```json
{"username": "admin", "password": "admin123", "email": "admin@cinekandyfilms.com"}
```

### Build for Production
```bash
npm run build  # frontend creates optimized /build folder
```

---

## Code Patterns & Conventions

### React Pages
- Use **functional components** with `useState`/`useEffect`
- **Fetch data on mount**: `useEffect(() => { axios.get(...).then(...) }, [])` (no dependencies list)
- **Category filtering**: Store `selectedCategory` in state, filter arrays with `item.category === selected || selected === 'all'`
- **Animations**: Import `containerVariants` from parent or create locally:
  ```javascript
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0 }
  };
  ```
  Wrap pages in `<AnimatePresence>` (in App.js) + use `<motion.div variants={containerVariants}>`
- **Token access**: `localStorage.getItem('token')` in headers or state check

### Express Routes (Backend)
- **Pattern**: Inline schemas → models → handlers in single file
- **Auth check**: Extract token from `req.header('Authorization')?.replace('Bearer ', '')`, verify with JWT secret
- **File uploads**: Use `multer` with single image field, validate MIME types: `filetypes = /jpeg|jpg|png|gif/`
- **Error responses**: Always return `{ error: message }` at status 500 for API errors
- **Query filtering**: Gallery category filter via `req.query.category`, return all if not specified
- **FormData uploads**: Frontend sends `formData.append('image', file)`, backend reads as `req.file.path`

### Gallery/Blog Workflow
1. **Display**: GET request returns array with `image: "/uploads/{timestamp}.jpg"` path
2. **Upload**: Frontend creates FormData, backend multer saves to `uploads/`, returns path in response
3. **Filtering**: Gallery supports categories (wedding/corporate/event/portrait), blog has `published` field
4. **Admin edit**: CRUD routes check token, validate body, then upsert in MongoDB

---

## Critical Gotchas

- **MongoDB**: Must be running locally (`mongod` process) or `.env` points to valid instance
- **JWT Secret**: Code default is `'cinekandy_secret_key_2026'` — override with `.env` in production
- **CORS**: Enabled for `localhost:3000` (Express uses `cors()` middleware)
- **File paths**: Uploaded images must exist in `backend/uploads/` to serve at `/uploads/filename`
- **Tailwind**: NOT used, all styling is CSS files (App.css, About.css, etc.) with CSS variables
- **No TypeScript/Tests**: Project is plain JavaScript, no test suite configured

---

## Adding Features Checklist

**New Gallery filter category?**
- Add to gallery categories list in Gallery.js
- Ensure items have matching `category` field in MongoDB

**New Blog field?**
- Update `blogSchema` in server.js
- Update Admin form to capture field
- Update Blog.js and BlogPost.js display

**New Page?**
- Create component in [pages/](frontend/src/pages/)
- Add route in App.js `Routes`
- Add link to `navLinks` array in App.js Navigation

**Auth changes?**
- Modify JWT secret/expiry in server.js login handler
- Update frontend localStorage logic
- Update authMiddleware token validation

---

## File References for Common Tasks
- Routes & models: [backend/server.js](backend/server.js)
- Pages & routing: [frontend/src/App.js](frontend/src/App.js)
- Styling reference: See [ALL_CSS_FILES.css](../ALL_CSS_FILES.css) for colors/vars
- Admin panel: [frontend/src/pages/admin/AdminDashboard.js](frontend/src/pages/admin/AdminDashboard.js)

