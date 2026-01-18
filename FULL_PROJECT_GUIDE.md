# CINE KANDY FILMS - Complete Website Project

## 🎬 Project Overview
A premium, full-stack media and event coverage platform featuring:
- Photography & Videography Services
- Dynamic Gallery with filtering
- Event Blog/News
- Admin Panel for content management
- Contact Form
- Professional UI with stunning animations

## 🎨 Design Features
- **Color Palette**: Cinematic gold (#C9A050), dark navy (#1A1A2E), elegant accents
- **Typography**: Playfair Display (headings), Crimson Text (body), Montserrat (UI)
- **Animations**: Framer Motion for smooth, professional transitions
- **Responsive**: Mobile-first design, works on all devices

## 📁 Project Structure

```
cinekandy-website/
├── frontend/                 # React.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js      ✅ Created
│   │   │   ├── Gallery.js   ✅ Created
│   │   │   ├── Services.js  ✅ Created
│   │   │   ├── About.js     ⚠️ Needs creation
│   │   │   ├── Contact.js   ⚠️ Needs creation
│   │   │   ├── Blog.js      ⚠️ Needs creation
│   │   │   ├── BlogPost.js  ⚠️ Needs creation
│   │   │   └── admin/
│   │   │       ├── AdminLogin.js      ⚠️ Needs creation
│   │   │       └── AdminDashboard.js  ⚠️ Needs creation
│   │   ├── App.js          ✅ Created
│   │   ├── App.css         ✅ Created
│   │   └── index.js        ⚠️ Needs creation
│   └── package.json        ✅ Created
│
└── backend/                  # Node.js + Express Backend
    ├── server.js            ✅ Created (Full API)
    ├── package.json         ✅ Created
    └── .env.example         ✅ Created
```

## 🚀 Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd cinekandy-website/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Create uploads directory:
```bash
mkdir uploads
```

5. Start MongoDB (make sure it's installed):
```bash
# On Linux/Mac:
sudo systemctl start mongod

# On Windows:
net start MongoDB
```

6. Create first admin user:
```bash
# Use Postman or curl to POST to:
POST http://localhost:5000/api/admin/create
Body: {
  "username": "admin",
  "password": "admin123",
  "email": "admin@cinekandyfilms.com"
}
```

7. Start backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd cinekandy-website/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Open browser to: http://localhost:3000

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery?category=wedding` - Filter by category
- `GET /api/blog` - Get all published blog posts
- `GET /api/blog/:id` - Get single blog post
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/create` - Create admin (disable in production)
- `GET /api/admin/stats` - Dashboard statistics

#### Gallery Management
- `POST /api/gallery` - Add gallery item (with image upload)
- `PUT /api/gallery/:id` - Update gallery item
- `DELETE /api/gallery/:id` - Delete gallery item

#### Blog Management
- `POST /api/blog` - Create blog post (with image upload)
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

#### Contact Management
- `GET /api/contact` - Get all contacts
- `PUT /api/contact/:id` - Update contact status
- `DELETE /api/contact/:id` - Delete contact

## 🎯 Key Features

### 1. Homepage
- Hero slider with 3 images
- Feature cards (Photography, Videography, Awards, Passion)
- Statistics section (Events, Photos, Experience, Satisfaction)
- Recent work grid
- Call-to-action section

### 2. Gallery
- Masonry grid layout
- Category filtering (All, Wedding, Corporate, Event, Portrait)
- Lightbox for full-size viewing
- Smooth animations

### 3. Services
- Service cards with features and pricing
- Wedding packages (Basic, Premium, Luxury)
- Call-to-action

### 4. Admin Panel Features
- Secure login with JWT authentication
- Dashboard with statistics
- Gallery management (CRUD operations)
- Blog post management
- Contact form submissions
- File upload for images

## 🎨 Color Variables

```css
--primary: #C9A050        (Gold)
--primary-light: #E4C585  (Light Gold)
--primary-dark: #9A7A3D   (Dark Gold)
--secondary: #1A1A2E      (Navy)
--secondary-light: #2D2D44
--accent: #D4AF37         (Bright Gold)
--dark: #0F0F1E           (Deep Navy)
--light: #FAFAFA          (Off White)
```

## 📱 Responsive Breakpoints

- Desktop: > 968px
- Tablet: 768px - 968px
- Mobile: < 768px

## 🔒 Security Features

- JWT authentication for admin
- Password hashing with bcrypt
- Protected API routes
- File upload validation
- CORS configuration

## 🚧 Remaining Tasks

1. Create Contact page (Contact.js + Contact.css)
2. Create About page (About.js + About.css)
3. Create Blog page (Blog.js + Blog.css)
4. Create BlogPost page (BlogPost.js)
5. Create AdminLogin component
6. Create AdminDashboard component
7. Create index.js entry point
8. Add axios API service file
9. Add environment configuration

## 📦 Dependencies

### Frontend
- react, react-dom
- react-router-dom (routing)
- framer-motion (animations)
- axios (API calls)
- lucide-react (icons)

### Backend
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- multer (file uploads)
- cors (cross-origin requests)
- dotenv (environment variables)

## 🎓 Code Quality

- Clean, modular code structure
- Consistent naming conventions
- Comprehensive comments
- Error handling
- Responsive design
- Accessibility features
- SEO optimization

## 📞 Support

For issues or questions:
- Email: info@cinekandyfilms.com
- Phone: +94 77 123 4567
- Location: Kandy, Sri Lanka

---

**Note**: This is a production-ready template. Customize content, images, and branding to match Cine Kandy Films' identity.
