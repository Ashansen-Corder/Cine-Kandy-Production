import React, { useState } from 'react';
import { Play, Maximize2, X } from 'lucide-react';

/**
 * VideoGalleryTimeline Component
 * A premium, staggered timeline-style video gallery with dark theme
 * Features:
 * - Alternating left/right layout (zig-zag)
 * - Central connecting timeline
 * - Fully responsive (single column on mobile)
 * - Lazy-loaded video players
 */

// Sample video data - replace with your own
const SAMPLE_VIDEOS = [
  {
    id: 1,
    title: 'EMILY + JEFF',
    subtitle: 'An Intimate Celebration',
    videoUrl: 'https://vimeo.com/1179892828',
    thumbnail: 'https://vumbnail.com/1179892828.jpg',
  },
  {
    id: 2,
    title: 'JOSH + NICOLE',
    subtitle: 'Mountain Elopement',
    videoUrl: 'https://vimeo.com/1179885305',
    thumbnail: 'https://vumbnail.com/1179885305.jpg',
  },
  {
    id: 3,
    title: 'ALYSSA + DAVID',
    subtitle: 'Desert Romance',
    videoUrl: 'https://vimeo.com/1179882525',
    thumbnail: 'https://vumbnail.com/1179882525.jpg',
  },
  {
    id: 4,
    title: 'CHAMOD + AYESHA',
    subtitle: 'Tropical Paradise',
    videoUrl: 'https://vimeo.com/1179885805',
    thumbnail: 'https://vumbnail.com/1179885805.jpg',
  },
  {
    id: 5,
    title: 'CHINTHAKA + DANANJALI',
    subtitle: 'Garden Elegance',
    videoUrl: 'https://vimeo.com/1179888247',
    thumbnail: 'https://vumbnail.com/1179888247.jpg',
  },
  {
    id: 6,
    title: 'DINIDU + THISURI',
    subtitle: 'Beachside Bliss',
    videoUrl: 'https://vimeo.com/1179890087',
    thumbnail: 'https://vumbnail.com/1179890087.jpg',
  },
];

// Extract Vimeo video ID from URL
const extractVideoId = (url) => {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
};

// Individual Video Card Component
const VideoCard = ({ video, onFullscreen }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractVideoId(video.videoUrl);

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-black border border-white/10 shadow-lg">
      {!isPlaying ? (
        // Thumbnail View
        <div className="relative w-full aspect-video bg-black">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          {/* Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white/95 hover:bg-white p-4 rounded-full transition-all"
            >
              <Play size={40} className="text-black fill-black" />
            </button>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider border border-white/30">
            Click to Play
          </div>

          {/* Title Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
            <h3 className="text-white text-lg md:text-xl font-semibold text-center tracking-wide">
              {video.title}
            </h3>
            <p className="text-white/70 text-sm mt-1">{video.subtitle}</p>
          </div>
        </div>
      ) : (
        // Video Player View
        <div className="relative w-full aspect-video bg-black">
          {videoId && (
            <iframe
              title={video.title}
              src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=false&portrait=false&title=false&byline=false`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => onFullscreen(video)}
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all z-50"
          >
            <Maximize2 size={20} className="text-black" />
          </button>

          {/* Title Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pointer-events-none">
            <h3 className="text-white text-lg md:text-xl font-semibold text-center tracking-wide">
              {video.title}
            </h3>
            <p className="text-white/70 text-sm mt-1">{video.subtitle}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Lightbox Component
const Lightbox = ({ video, onClose }) => {
  const videoId = extractVideoId(video.videoUrl);

  return (
    <div
      className="fixed inset-0 bg-black/98 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 bg-white/15 border border-white/30 hover:bg-white/25 rounded-full w-14 h-14 flex items-center justify-center text-white transition-all z-50"
      >
        <X size={32} />
      </button>

      <div
        className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {videoId && (
          <iframe
            title={video.title}
            src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=false&portrait=false&title=true&byline=false`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>

      {/* Video Title Below */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-white text-2xl font-semibold tracking-wide">
          {video.title}
        </h2>
        <p className="text-white/60 text-sm mt-2">{video.subtitle}</p>
      </div>
    </div>
  );
};

// Main Gallery Component
export default function VideoGalleryTimeline({ videos = SAMPLE_VIDEOS }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-96 md:h-screen flex items-center justify-center text-center px-4 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Our Gallery
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            A collection of our finest work capturing life's beautiful moments
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-0">
          {/* Section Title */}
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">
              Browse Our Work
            </h2>
            <p className="text-gray-400">Explore our portfolio of premium video productions</p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/20 via-white/40 to-white/20 transform -translate-x-1/2 hidden md:block" />

            {/* Video Items */}
            <div className="space-y-16 md:space-y-20">
              {videos.map((video, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div key={video.id} className="relative">
                    {/* Desktop: Alternating Layout */}
                    <div className="hidden md:grid md:grid-cols-2 md:gap-8 md:items-center">
                      {isLeft ? (
                        <>
                          {/* Left Content */}
                          <div className="text-right pr-8">
                            <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
                              {video.title}
                            </h3>
                            <p className="text-gray-400">{video.subtitle}</p>
                          </div>

                          {/* Timeline Dot */}
                          <div className="relative">
                            <div className="absolute left-1/2 top-1/4 w-4 h-4 bg-white/20 border-2 border-white/40 rounded-full transform -translate-x-1/2 hidden md:block" />
                            {/* Video on Right */}
                            <div className="ml-4">
                              <VideoCard
                                video={video}
                                onFullscreen={setSelectedVideo}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Timeline Dot */}
                          <div className="relative">
                            <div className="absolute right-1/2 top-1/4 w-4 h-4 bg-white/20 border-2 border-white/40 rounded-full transform translate-x-1/2 hidden md:block" />
                            {/* Video on Left */}
                            <div className="mr-4">
                              <VideoCard
                                video={video}
                                onFullscreen={setSelectedVideo}
                              />
                            </div>
                          </div>

                          {/* Right Content */}
                          <div className="pl-8">
                            <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
                              {video.title}
                            </h3>
                            <p className="text-gray-400">{video.subtitle}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Mobile: Single Column */}
                    <div className="md:hidden">
                      <div className="relative pl-8">
                        {/* Timeline Dot on Left */}
                        <div className="absolute left-0 top-6 w-3 h-3 bg-white/20 border-2 border-white/40 rounded-full transform -translate-x-1/2" />

                        <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                          {video.title}
                        </h3>
                        <p className="text-gray-400 mb-4">{video.subtitle}</p>
                        <VideoCard
                          video={video}
                          onFullscreen={setSelectedVideo}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/20 via-white/40 to-white/20 md:hidden" />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedVideo && (
        <Lightbox video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
