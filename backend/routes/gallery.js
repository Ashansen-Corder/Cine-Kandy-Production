const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

// Helper function to extract Vimeo ID
function extractVimeoId(url) {
  if (!url) return null;
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * GET /api/gallery
 * Fetch all gallery items with optional category filtering
 * Query: ?category=Weddings
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    const items = await Gallery.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/gallery/:id
 * Fetch single gallery item by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/gallery
 * Create new gallery item (Image or Video)
 * 
 * Required fields:
 * - title: string
 * - category: 'Weddings' | 'Corporate' | 'Events'
 * - type: 'Image' | 'Video'
 * 
 * For Image: { image: "path/to/image.jpg" }
 * For Video: { vimeoUrl: "https://vimeo.com/123456" }
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, category, type, image, vimeoUrl, featured } = req.body;

    // Validation
    if (!title || !category || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, category, type'
      });
    }

    // Type-specific validation
    if (type === 'Image' && !image) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required for Image type'
      });
    }

    if (type === 'Video' && !vimeoUrl) {
      return res.status(400).json({
        success: false,
        error: 'Vimeo URL is required for Video type'
      });
    }

    // Build gallery item
    const galleryData = {
      title,
      description: description || '',
      category,
      type,
      featured: featured || false
    };

    // Add type-specific data
    if (type === 'Image') {
      galleryData.image = image;
    } else if (type === 'Video') {
      galleryData.vimeoUrl = vimeoUrl;
      const vimeoId = extractVimeoId(vimeoUrl);
      
      if (!vimeoId) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Vimeo URL. Expected format: https://vimeo.com/123456'
        });
      }
      
      galleryData.vimeoId = vimeoId;
    }

    // Create and save
    const newItem = new Gallery(galleryData);
    await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: newItem
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/gallery/:id
 * Update gallery item
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, description, category, type, image, vimeoUrl, featured } = req.body;

    // Build update object
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (type) updateData.type = type;
    if (featured !== undefined) updateData.featured = featured;

    // Handle image updates
    if (type === 'Image' && image) {
      updateData.image = image;
      updateData.vimeoUrl = undefined;
      updateData.vimeoId = undefined;
    }

    // Handle video updates
    if (type === 'Video' && vimeoUrl) {
      updateData.vimeoUrl = vimeoUrl;
      const vimeoId = extractVimeoId(vimeoUrl);
      
      if (!vimeoId) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Vimeo URL'
        });
      }
      
      updateData.vimeoId = vimeoId;
      updateData.image = undefined;
    }

    updateData.updatedAt = Date.now();

    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/gallery/:id
 * Delete gallery item
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Gallery.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
      data: deletedItem
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
