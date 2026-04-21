# VideoGalleryTimeline Component - Usage Guide

## Overview
A premium, reusable React component that creates a staggered timeline-style video gallery with a dark theme. Perfect for portfolio sites, wedding videography, and creative agencies.

## Features
✅ **Alternating Layout**: Videos zigzag left and right across desktop
✅ **Timeline Line**: Continuous vertical line connecting all videos
✅ **Lazy Loading**: Videos only load when played (performance optimized)
✅ **Fully Responsive**: Single-column centered layout on mobile
✅ **Dark Theme**: Premium, cinematic aesthetic
✅ **Lightbox Modal**: Full-screen video viewing
✅ **Tailwind CSS**: Built entirely with utility classes (no external dependencies)

## Installation

### Prerequisites
- React 16.8+
- Tailwind CSS configured
- lucide-react (for icons)

### Setup
```bash
npm install lucide-react
```

## Basic Usage

### 1. Import the Component
```jsx
import VideoGalleryTimeline from './components/VideoGalleryTimeline';

export default function App() {
  return <VideoGalleryTimeline />;
}
```

### 2. Use Default Sample Data
The component comes with 6 built-in sample videos. Simply render it as shown above.

### 3. Pass Custom Video Data
```jsx
const myVideos = [
  {
    id: 1,
    title: 'COUPLE NAME',
    subtitle: 'Wedding Type or Location',
    videoUrl: 'https://vimeo.com/YOUR_VIDEO_ID',
    thumbnail: 'https://vumbnail.com/YOUR_VIDEO_ID.jpg',
  },
  {
    id: 2,
    title: 'ANOTHER COUPLE',
    subtitle: 'Destination Wedding',
    videoUrl: 'https://vimeo.com/ANOTHER_ID',
    thumbnail: 'https://vumbnail.com/ANOTHER_ID.jpg',
  },
  // Add more videos...
];

export default function App() {
  return <VideoGalleryTimeline videos={myVideos} />;
}
```

## Data Structure

Each video object should have:

```typescript
{
  id: number;              // Unique identifier
  title: string;           // Main title (e.g., "EMILY + JEFF")
  subtitle: string;        // Secondary text (e.g., "Mountain Elopement")
  videoUrl: string;        // Full Vimeo URL
  thumbnail: string;       // Thumbnail image URL
}
```

### Getting Vimeo Thumbnails
Vumbnail is a free service for Vimeo thumbnails:
```
https://vumbnail.com/{VIMEO_ID}.jpg
```

Or use a direct Vimeo API call:
```
https://vimeo.com/api/v2/video/{VIMEO_ID}.json
```

## Customization

### Change Colors
Edit the Tailwind classes in the component. Key classes:
- `bg-black` - Background color
- `text-white` - Text color
- `border-white/10` - Border colors
- `bg-gradient-to-b from-white/20 via-white/40 to-white/20` - Timeline line

### Change Spacing
Modify these values:
- `py-20` - Vertical padding of gallery section
- `space-y-16 md:space-y-20` - Gap between videos
- `md:gap-8` - Gap between left/right content

### Change Typography
Update Tailwind size classes:
- `text-2xl md:text-4xl` - Title sizes
- `font-bold` - Font weight
- `tracking-wide` - Letter spacing

### Disable Lightbox
Simply remove or comment out the Lightbox modal at the bottom:
```jsx
{selectedVideo && (
  <Lightbox video={selectedVideo} onClose={() => setSelectedVideo(null)} />
)}
```

## Layout Explanation

### Desktop (md and above)
- **Left items** (even index): Content on left, video on right
- **Right items** (odd index): Video on left, content on right
- Central timeline line with connecting dots

### Mobile (below md)
- All items in single column
- Timeline line on the left
- Full width videos

## Advanced Usage

### Custom Hero Section
Replace the hero div with your own:
```jsx
<div className="custom-hero">
  {/* Your custom content */}
</div>
```

### Add Filtering
Wrap the component and add filter buttons:
```jsx
const [filter, setFilter] = useState('all');

const filtered = filter === 'all' 
  ? videos 
  : videos.filter(v => v.category === filter);

return <VideoGalleryTimeline videos={filtered} />;
```

### Integrate with CMS
Replace SAMPLE_VIDEOS with API data:
```jsx
const [videos, setVideos] = useState([]);

useEffect(() => {
  fetch('/api/videos')
    .then(res => res.json())
    .then(data => setVideos(data));
}, []);

return <VideoGalleryTimeline videos={videos} />;
```

## Performance Optimization

1. **Lazy Loading**: Videos don't load until clicked
2. **Lazy Image Loading**: Thumbnails use `loading="lazy"`
3. **Optimized Re-renders**: Component uses functional components with hooks

## Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Fully responsive

## Troubleshooting

### Vimeo videos not loading
- Verify video IDs are correct
- Check that videos are embeddable
- Ensure CORS is not blocking requests

### Timeline line not showing on desktop
- Verify Tailwind CSS is loaded
- Check that screen is `md` breakpoint or larger
- Ensure `hidden md:block` classes are working

### Mobile layout issues
- Clear browser cache
- Check responsive breakpoints
- Verify Tailwind config includes mobile breakpoints

## License & Attribution
Free to customize and use in your projects.

## Support
For issues or questions, refer to the component comments or modify as needed for your use case.
