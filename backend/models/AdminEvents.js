import React, { useState } from 'react';
import axios from 'axios';

const AdminEvents = () => {
  const [eventData, setEventData] = useState({ title: '', description: '', mediaUrl: '', mediaType: 'Image' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/events', eventData);
      alert("Event Added Successfully!");
      setEventData({ title: '', description: '', mediaUrl: '', mediaType: 'Image' });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="admin-container" style={{ padding: '50px', color: '#fff' }}>
      <h2>Add New Event / Story</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
        <input type="text" placeholder="Event Title" value={eventData.title} onChange={(e) => setEventData({...eventData, title: e.target.value})} required />
        <textarea placeholder="Description" value={eventData.description} onChange={(e) => setEventData({...eventData, description: e.target.value})} required />
        <input type="text" placeholder="Media URL (Image or Vimeo link)" value={eventData.mediaUrl} onChange={(e) => setEventData({...eventData, mediaUrl: e.target.value})} required />
        <select value={eventData.mediaType} onChange={(e) => setEventData({...eventData, mediaType: e.target.value})}>
          <option value="Image">Image</option>
          <option value="Video">Video</option>
        </select>
        <button type="submit" style={{ background: '#C9A05D', color: '#000', padding: '10px', border: 'none', cursor: 'pointer' }}>Publish Event</button>
      </form>
    </div>
  );
};

export default AdminEvents;