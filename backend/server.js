const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinekandy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Error:', err));

// Schemas
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: String,
  image: String,
  category: String,
  author: String,
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Admin = mongoose.model('Admin', adminSchema);
const Gallery = mongoose.model('Gallery', gallerySchema);
const Blog = mongoose.model('Blog', blogSchema);
const Contact = mongoose.model('Contact', contactSchema);

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cinekandy_secret_key_2026');
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// ===== ADMIN ROUTES =====

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: admin._id }, 
      process.env.JWT_SECRET || 'cinekandy_secret_key_2026',
      { expiresIn: '7d' }
    );
    
    res.json({ token, admin: { id: admin._id, username: admin.username, email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Admin (First Time Setup - Remove in production)
app.post('/api/admin/create', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new Admin({
      username,
      password: hashedPassword,
      email
    });
    
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== GALLERY ROUTES =====

// Get all gallery items
app.get('/api/gallery', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'all' ? { category } : {};
    const items = await Gallery.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add gallery item
app.post('/api/gallery', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, featured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const item = new Gallery({
      title,
      description,
      category,
      image,
      featured: featured === 'true'
    });
    
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update gallery item
app.put('/api/gallery/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, featured } = req.body;
    const updateData = { title, description, category, featured: featured === 'true' };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete gallery item
app.delete('/api/gallery/:id', authMiddleware, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== BLOG ROUTES =====

// Get all blog posts
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog post
app.get('/api/blog/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create blog post
app.post('/api/blog', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt, category, author, published } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const post = new Blog({
      title,
      content,
      excerpt,
      image,
      category,
      author,
      published: published === 'true'
    });
    
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog post
app.put('/api/blog/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt, category, author, published } = req.body;
    const updateData = { title, content, excerpt, category, author, published: published === 'true' };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete blog post
app.delete('/api/blog/:id', authMiddleware, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CONTACT ROUTES =====

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });
    
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all contacts (Admin only)
app.get('/api/contact', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact status
app.put('/api/contact/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete contact
app.delete('/api/contact/:id', authMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== DASHBOARD STATS =====
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const galleryCount = await Gallery.countDocuments();
    const blogCount = await Blog.countDocuments();
    const contactCount = await Contact.countDocuments({ status: 'new' });
    const totalContacts = await Contact.countDocuments();
    
    res.json({
      gallery: galleryCount,
      blogs: blogCount,
      newContacts: contactCount,
      totalContacts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cine Kandy Films API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
