import React, { useState } from 'react';
import { Send, FileText, MessageSquare, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './Contact.css';

const TARGET_PHONE_NUMBER = '94752934059';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    spouseName: '',
    phone: '',
    instagram: '',
    inquiryType: '',
    weddingDate: '',
    weddingLocation: '',
    budget: '',
    attracted: '',
    additionalInfo: ''
  });
  const [status, setStatus] = useState('');
  const [lastSubmittedData, setLastSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePDF = (data) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Dark Header Banner
    doc.setFillColor(17, 17, 17);
    doc.rect(0, 0, 210, 42, 'F');

    // Gold Accent Line
    doc.setFillColor(255, 215, 0);
    doc.rect(0, 41, 210, 1.5, 'F');

    // Brand Name & Subtitle
    doc.setTextColor(255, 215, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CINE KANDY FILMS', 15, 18);

    doc.setTextColor(230, 230, 230);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Wedding & Event Inquiry Summary', 15, 27);

    // Date
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.setTextColor(160, 160, 160);
    doc.setFontSize(9);
    doc.text(`Date: ${today}`, 150, 27);

    let y = 54;

    // Section Header
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('CLIENT & INQUIRY DETAILS', 15, y);

    y += 3;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.4);
    doc.line(15, y, 195, y);

    y += 8;

    const fields = [
      { label: 'Client Name', value: data.name },
      { label: 'Email Address', value: data.email },
      { label: 'Phone Number', value: data.phone || 'N/A' },
      { label: 'Spouse Name', value: data.spouseName || 'N/A' },
      { label: 'Instagram Handle', value: data.instagram || 'N/A' },
      { label: 'Inquiry Type', value: data.inquiryType || 'General Inquiry' },
      { label: 'Wedding Date', value: data.weddingDate || 'N/A' },
      { label: 'Wedding Location', value: data.weddingLocation || 'N/A' },
      { label: 'Approximate Budget', value: data.budget || 'N/A' },
      { label: 'Attracted To', value: data.attracted || 'N/A' }
    ];

    fields.forEach((field) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text(`${field.label}:`, 15, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(String(field.value), 65, y);

      y += 8;
    });

    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text('ADDITIONAL STORY & DETAILS', 15, y);

    y += 3;
    doc.line(15, y, 195, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);

    const splitText = doc.splitTextToSize(data.additionalInfo || 'None provided.', 180);
    doc.text(splitText, 15, y);

    // Footer Box
    doc.setFillColor(248, 248, 248);
    doc.rect(15, 260, 180, 22, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.rect(15, 260, 180, 22, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text('Cine Kandy Films | Official Inquiry PDF', 105, 268, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Direct WhatsApp: 0752934059 | Sent via Cine Kandy Website', 105, 274, { align: 'center' });

    const safeName = (data.name || 'Inquiry').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `CineKandy_Inquiry_${safeName}.pdf`;
    doc.save(filename);
  };

  const openWhatsApp = (data) => {
    const message = `*CINE KANDY FILMS - NEW INQUIRY* 📄

*Client Name:* ${data.name}
*Email:* ${data.email}
*Phone:* ${data.phone || 'N/A'}
*Spouse Name:* ${data.spouseName || 'N/A'}
*Instagram:* ${data.instagram || 'N/A'}
*Inquiry Type:* ${data.inquiryType || 'General Inquiry'}
*Wedding Date:* ${data.weddingDate || 'N/A'}
*Location:* ${data.weddingLocation || 'N/A'}
*Budget:* ${data.budget || 'N/A'}
*Attracted To:* ${data.attracted || 'N/A'}

*Additional Info:*
${data.additionalInfo || 'N/A'}

*(PDF Inquiry Document has been generated & downloaded to client device)*`;

    const waUrl = `https://wa.me/${TARGET_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const currentData = { ...formData };
    setLastSubmittedData(currentData);

    try {
      // 1. Generate & download PDF locally
      generatePDF(currentData);

      // 2. Save inquiry to backend API (without mandatory email sending)
      await axios.post('http://localhost:5000/api/contact', {
        name: currentData.name,
        email: currentData.email,
        phone: currentData.phone,
        message: `
Spouse Name: ${currentData.spouseName}
Instagram: ${currentData.instagram}
Inquiry Type: ${currentData.inquiryType}
Wedding Date: ${currentData.weddingDate}
Wedding Location: ${currentData.weddingLocation}
Budget: ${currentData.budget}
What Attracted You: ${currentData.attracted}
Additional Info: ${currentData.additionalInfo}
        `
      }).catch(err => console.warn('Backend save notice:', err));

      // 3. Open WhatsApp chat with target number 0752934059
      openWhatsApp(currentData);

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        spouseName: '',
        phone: '',
        instagram: '',
        inquiryType: '',
        weddingDate: '',
        weddingLocation: '',
        budget: '',
        attracted: '',
        additionalInfo: ''
      });
    } catch (error) {
      console.error('Contact submit error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">
      {/* Header Section */}
      <div className="contact-header">
        <h1 className="contact-main-heading">Let's connect together</h1>
        <p className="contact-sub-heading">Tell us your story and let's capture your most beautiful moments.</p>
      </div>

      {/* Form Section */}
      <div className="contact-container">
        <form className="inquiry-form" onSubmit={handleSubmit}>
          {/* Your Name */}
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Josh Rexford"
              required
            />
          </div>

          {/* Your Email */}
          <div className="form-group">
            <label htmlFor="email">Your Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@joshrexford.com"
              required
            />
          </div>

          {/* Spouse Name */}
          <div className="form-group">
            <label htmlFor="spouseName">What's your future spouse's name?</label>
            <input
              id="spouseName"
              type="text"
              name="spouseName"
              value={formData.spouseName}
              onChange={handleChange}
              placeholder="Kendyll Rexford"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="E.g. +94 77 123 4567"
            />
          </div>

          {/* Instagram */}
          <div className="form-group">
            <label htmlFor="instagram">Drop your Instagram handles so we can connect!</label>
            <input
              id="instagram"
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@joshrexford.com"
            />
          </div>

          {/* Inquiry Type */}
          <div className="form-group">
            <label htmlFor="inquiryType">What are you inquiring about specifically?</label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="wedding">Wedding Photography</option>
              <option value="engagement">Engagement Session</option>
              <option value="bridal">Bridal Photography</option>
              <option value="videography">Videography</option>
              <option value="dronography">Dronography</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Wedding Date */}
          <div className="form-group">
            <label htmlFor="weddingDate">Wedding Date</label>
            <input
              id="weddingDate"
              type="date"
              name="weddingDate"
              value={formData.weddingDate}
              onChange={handleChange}
            />
          </div>

          {/* Wedding Location */}
          <div className="form-group">
            <label htmlFor="weddingLocation">Wedding Location</label>
            <input
              id="weddingLocation"
              type="text"
              name="weddingLocation"
              value={formData.weddingLocation}
              onChange={handleChange}
              placeholder="Kandy, Colombo, or destination location"
            />
          </div>

          {/* Budget */}
          <div className="form-group">
            <label htmlFor="budget">Approximate budget</label>
            <input
              id="budget"
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. LKR 200,000"
            />
          </div>

          {/* What Attracted You */}
          <div className="form-group">
            <label htmlFor="attracted">What attracted you to my work?</label>
            <input
              id="attracted"
              type="text"
              name="attracted"
              value={formData.attracted}
              onChange={handleChange}
              placeholder="Tell us what you love about our style"
            />
          </div>

          {/* Additional Info */}
          <div className="form-group full-width">
            <label htmlFor="additionalInfo">Anything else you'd like to share? *</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Tell me your whole story or share fun wedding details – I'm all ears!"
              rows="5"
              required
            />
          </div>

          {/* Status Notifications */}
          {status === 'success' && (
            <div className="pdf-success-box">
              <div className="pdf-success-header">
                <CheckCircle2 size={24} className="success-icon" />
                <div>
                  <h4>Inquiry Sent Successfully!</h4>
                  <p>Your inquiry PDF was generated & sent directly to <strong>0752934059</strong> via WhatsApp.</p>
                </div>
              </div>

              {lastSubmittedData && (
                <div className="pdf-action-buttons">
                  <button
                    type="button"
                    className="pdf-btn download-btn"
                    onClick={() => generatePDF(lastSubmittedData)}
                  >
                    <FileText size={16} /> Re-download PDF
                  </button>
                  <button
                    type="button"
                    className="pdf-btn whatsapp-btn"
                    onClick={() => openWhatsApp(lastSubmittedData)}
                  >
                    <MessageSquare size={16} /> Open WhatsApp (0752934059)
                  </button>
                </div>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="error-msg">
              Failed to process inquiry. Please try again or contact 0752934059 on WhatsApp directly.
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={status === 'sending'}>
            <Send size={18} />
            {status === 'sending' ? 'Generating PDF & Sending...' : 'Send Message (PDF & WhatsApp)'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
