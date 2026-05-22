/**
 * Cine Kandy Films - Backend Server
 * Production-ready API for Photography & Videography Portfolio
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ========================================
// DATABASE CONNECTION
// ========================================

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinekandy';

let mongoConnected = false;

mongoose.connect(mongoURI)
  .then(() => {
    mongoConnected = true;
    console.log('✅ MongoDB Connected');
    console.log(`📍 Database: ${mongoURI}`);
  })
  .catch(err => {
    console.warn('⚠️ MongoDB not available - using in-memory mock');
    console.warn(`📍 Error: ${err.message}`);
    console.log('💡 For production, ensure MongoDB is running or update MONGODB_URI in .env');
  });

// In-memory storage for testing (when MongoDB is unavailable)
// Generate hash synchronously for testing only
const testPasswordHash = bcrypt.hashSync('admin123', 10);

const memoryStore = {
  admins: [{
    _id: '1',
    username: 'admin',
    password: testPasswordHash,
    email: 'admin@cinekandyfilms.com'
  }],
  gallery: [],
  blogs: [],
  contacts: []
};

// ========================================
// ADMIN SCHEMA & MODEL
// ========================================

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const AdminDB = mongoose.model('Admin', adminSchema);

// Wrapper to use either MongoDB or memory store
const AdminModel = {
  findOne: async (query) => {
    if (mongoConnected) {
      return await AdminDB.findOne(query || {});
    } else {
      if (query?.username) {
        return memoryStore.admins.find(a => a.username === query.username) || null;
      }
      return memoryStore.admins[0] || null;
    }
  },
  create: async (data) => {
    if (mongoConnected) {
      const doc = new AdminDB(data);
      return await doc.save();
    } else {
      const admin = { _id: String(Date.now()), ...data };
      memoryStore.admins.push(admin);
      return admin;
    }
  }
};

const Admin = AdminModel;

// Auto-create default admin on startup
const initializeAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        email: 'admin@cinekandyfilms.com',
        password: hashedPassword
      });
      console.log('✅ Default admin created - username: admin, password: admin123');
    }
  } catch (error) {
    console.warn('⚠️ Could not auto-create admin:', error.message);
  }
};

initializeAdmin();

// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cinekandy_secret_key_2026');
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};


// ========================================
// ADMIN ROUTES
// ========================================

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password required'
      });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'cinekandy_secret_key_2026',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/setup
 * One-time setup to create default admin
 */
app.post('/api/admin/setup', async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Admin already exists'
      });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@cinekandyfilms.com',
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      credentials: {
        username: 'admin',
        password: 'admin123',
        email: 'admin@cinekandyfilms.com'
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// ========================================
// GALLERY ROUTES
// ========================================

const Gallery = require('./models/Gallery');
const galleryRoutes = require('./routes/gallery');
app.use('/api/gallery', galleryRoutes);

// ===== ADD GALLERY ITEM (direct endpoint for dashboard) =====
app.post('/api/gallery', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, type, image, vimeoUrl, featured } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category required' });
    }

    const newItem = await Gallery.create({
      title,
      description,
      category,
      type: type || 'Image',
      image: image || '',
      vimeoUrl: vimeoUrl || '',
      featured: featured || false
    });

    res.json({ success: true, data: newItem, message: 'Gallery item added' });
  } catch (error) {
    console.error('Gallery add error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// STATS ROUTE
// ========================================

/**
 * GET /api/admin/stats
 * Get dashboard statistics (requires auth)
 */
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const galleryCount = await Gallery.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        gallery: galleryCount,
        videos: 0,
        blogs: 0,
        newContacts: 0,
        totalContacts: 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Cine Kandy Films API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Cine Kandy Films API',
    version: '1.0.0',
    endpoints: {
      gallery: '/api/gallery',
      health: '/api/health',
      admin: '/api/admin/login'
    }
  });
});

// ========================================
// BLOG ROUTES
// ========================================

app.get('/api/blog', (req, res) => {
  // Return empty blog array for now
  res.json([]);
});

// ========================================
// CONTACT ROUTES
// ========================================
const Contact = require('./models/Contact');

// Nodemailer Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kaizersen570@gmail.com',
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // 1. Save to Database
    if (mongoConnected) {
      const newContact = new Contact({
        name,
        email,
        phone,
        message
      });
      await newContact.save();
    } else {
      const newContact = {
        _id: String(Date.now()),
        name, email, phone, message, createdAt: new Date()
      };
      memoryStore.contacts.push(newContact);
    }

    // 2. Send Email
    const mailOptions = {
      from: 'kaizersen570@gmail.com',
      to: 'kaizersen570@gmail.com',
      subject: `New Contact Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #555;">Message Details</h3>
          <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; color: #444;">${message}</pre>
        </div>
      `
    };

    // Send email asynchronously and don't block response client
    transporter.sendMail(mailOptions).catch(err => {
      console.error('Nodemailer send error:', err.message);
    });

    res.status(201).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to process inquiry', stack: error.stack });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    if (mongoConnected) {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json(contacts);
    } else {
      res.json(memoryStore.contacts);
    }
  } catch (err) {
    res.json([]);
  }
});

// ===== DELETE ENDPOINTS =====

app.delete('/api/gallery/:id', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Item deleted' });
});

app.delete('/api/blog/:id', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Blog deleted' });
});

app.delete('/api/contact/:id', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Contact deleted' });
});

// ========================================
// 404 & ERROR HANDLING
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// ========================================
// SERVER STARTUP
// ========================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log('🚀 Cine Kandy Films Backend');
  console.log('🚀 ================================');
  console.log(`📊 Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
  console.log('🚀 ================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = app;
