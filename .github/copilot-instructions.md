# AI Coding Agent Instructions - Cine Kandy Films Website

## Project Overview
Full-stack MERN (MongoDB, Express, React, Node) platform for premium photography/videography services. Portfolio site with admin-managed gallery, blog, and contact forms.

**Key Contexts**: Cinematic branding (gold #C9A050, navy #1A1A2E), smooth animations via Framer Motion, JWT-based auth for admin panel.

---

## Architecture & Key Files

### Frontend (React 18 + React Router v6)
- **Entry**: [frontend/src/index.js](frontend/src/index.js)
- **Main App**: [frontend/src/App.js](frontend/src/App.js) - Navigation & routing setup
- **Pages** (all in [frontend/src/pages/](frontend/src/pages/)):
  - `Home.js` - Landing page with hero slider, stats, recent work showcase
  - `Gallery.js` - Filtered gallery (categories: wedding/corporate/event/portrait) with modal lightbox
  - `Services.js` - Service offerings display
  - `Blog.js` - Published blog posts listing
  - `BlogPost.js` - Individual post detail view
  - `Contact.js` - Contact form submission
  - `About.js` - Company info
  - `admin/AdminLogin.js` & `admin/AdminDashboard.js` - Admin panel

**Key Dependencies**:
- `axios` - HTTP client for API calls to `http://localhost:5000/api/*`
- `framer-motion` - Page/component animations (containerVariants, AnimatePresence patterns)
- `lucide-react` - Icon library (Camera, Film, Menu, X, etc.)
- `react-router-dom` - Client-side routing with `useLocation()` hook

### Backend (Express + MongoDB)
- **Main Server**: [backend/server.js](backend/server.js) - All routes in single file
- **Database**: MongoDB at `mongodb://localhost:27017/cinekandy` (configurable via `.env`)
- **Upload**: Local filesystem storage in `backend/uploads/` directory

**Data Models**:
- **Admin** - username/email/hashedPassword (auth via JWT)
- **Gallery** - title/description/category/image/featured/createdAt
- **Blog** - title/content/excerpt/image/category/author/published
- **Contact** - name/email/phone/message/status/createdAt

**API Routes Pattern**:
- Public reads: `GET /api/gallery`, `GET /api/blog` - No auth required
- Admin write/edit: `POST/PUT/DELETE /api/gallery`, `POST/PUT/DELETE /api/blog` - Requires `Authorization: Bearer <token>` header
- Auth: `POST /api/admin/login` returns JWT token (expires 7d)

---

## Developer Workflows

### Backend Setup & Running
```bash
cd backend
npm install
cp .env.example .env              # Configure MONGODB_URI, JWT_SECRET
mkdir uploads                      # File upload directory
npm run dev                        # Starts with nodemon on port 5000
```

### Frontend Setup & Running
```bash
cd frontend
npm install
npm start                          # React dev server on port 3000
npm run build                      # Production build
```

### Initial Admin User Creation
Send POST to `http://localhost:5000/api/admin/create`:
```json
{
  "username": "admin",
  "password": "admin123",
  "email": "admin@cinekandyfilms.com"
}
```
Then login via AdminLogin page to get JWT token (stored in localStorage).

### API Testing
- Use Postman/curl with `Authorization: Bearer <token>` header for protected routes
- File uploads use `multipart/form-data` with `image` field

---

## Code Patterns & Conventions

### React Component Structure (Frontend)
- **Functional components** with hooks (`useState`, `useEffect`)
- **Framer Motion animations** for page transitions:
  - Use `containerVariants` object for consistent animation timing
  - Wrap lists with `<AnimatePresence>` for exit animations
  - Page sections animate on mount with `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`
- **Responsive layouts**: Mobile-first design, breakpoints handled in CSS (not tailwind)
- **Category filtering**: `useState('all')` then filter arrays based on selection
- **Modal patterns**: Gallery uses lightbox with `selectedImage` state + portal-like overlay

### Express Route Patterns (Backend)
- Inline schemas using `mongoose.Schema` + `mongoose.model()`
- Auth middleware: Check `Bearer` token from `req.header('Authorization')`
- File upload via `multer`: Single image field, 10MB limit, image types only
- Error handling: `try/catch` blocks return `{ error: message }` at 500 status
- Query filtering: `req.query.category` for gallery category filter
- Always validate `req.body` before database operations

### Component-Backend Communication
- Frontend uses `axios` to call `http://localhost:5000/api/*`
- Pass JWT token in headers: `headers: { 'Authorization': `Bearer ${token}` }`
- Gallery/Blog data fetched once on mount via `useEffect` + `axios.get()`
- File uploads via FormData: `formData.append('image', file)` + multer middleware

---

## Critical Integration Points

### Admin Panel Flow
1. AdminLogin submits credentials → `/api/admin/login` → receives JWT token
2. Token stored in `localStorage` (convention: check for presence to guard AdminDashboard)
3. AdminDashboard makes authenticated requests with token in headers
4. CRUD operations on Gallery/Blog with file uploads

### Gallery Display Flow
1. Home & Gallery pages call `GET /api/gallery` (public, no auth)
2. Filter by category via `?category=wedding` query param
3. Image paths returned as `/uploads/{filename}` (served statically by Express)
4. Frontend renders via CSS grid + modal lightbox on click

### Blog Publishing
- Draft/publish toggle via `published` field (boolean)
- Only `published: true` posts returned from `GET /api/blog`
- Admin can create unpublished drafts before going live

---

## Important Gotchas & Dependencies

- **MongoDB Connection**: Must be running locally or `.env` must point to valid instance
- **JWT Secret**: Default is `'cinekandy_secret_key_2026'` in code—change via `.env` in production
- **File Paths**: Uploaded images served from `/uploads/` directory relative to backend root
- **CORS**: Enabled by default (`cors` middleware) for frontend on localhost:3000
- **React Scripts**: Frontend uses `react-scripts` (CRA under the hood)
- **No Test Suite**: Currently no tests configured—bare `npm test` placeholder

---

## When Adding Features

**New Gallery Item Type?** → Extend `gallerySchema` + Gallery model, add route handlers, update frontend filter categories  
**New Blog Field?** → Update `blogSchema` + ensure Admin form captures it + Blog display renders it  
**Authentication Change?** → Update auth middleware + token generation in login route + frontend localStorage logic  
**New Page?** → Create component in `pages/`, add route in App.js Router, add link in Navigation navLinks array  
**Styling**: Reference color palette (#C9A050 gold, #1A1A2E navy) in CSS files + maintain Framer Motion animation consistency

