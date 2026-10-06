const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be longer than 500 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Weddings', 'Corporate', 'Events'],
      default: 'Weddings'
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['Image', 'Video'],
      default: 'Image'
    },
    // For Image type: filename or URL path
    image: {
      type: String,
      required: function() {
        return this.type === 'Image';
      }
    },
    // For Video type: Vimeo URL
    vimeoUrl: {
      type: String,
      required: function() {
        return this.type === 'Video' && !this.videoUrl;
      }
    },
    // Optional self-hosted MP4/WebM/OGG source. Prefer H.264 MP4 for broad browser support.
    videoUrl: {
      type: String,
      required: function() {
        return this.type === 'Video' && !this.vimeoUrl;
      }
    },
    // Lightweight preview image shown before a video source is loaded.
    poster: {
      type: String,
      trim: true
    },
    // Extracted Vimeo video ID for embed purposes
    vimeoId: {
      type: String,
      sparse: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
gallerySchema.index({ category: 1, createdAt: -1 });
gallerySchema.index({ featured: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
