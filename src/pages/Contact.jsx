import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Github,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple Validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('sending');

    try {
      // ---------- EMAILJS CONFIGURATION ----------
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID; 
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Required this in the env. veriable
      // VITE_EMAILJS_SERVICE_ID='service_xxxxxxx'
      // VITE_EMAILJS_TEMPLATE_ID='template_xxxxxxx'
      // VITE_EMAILJS_PUBLIC_KEY='public_key' 
      // -------------------------------------------

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone || "Not provided",
          message: formData.message,
          to_name: "Leejaw", // Optional: customize recipient name
        },
        PUBLIC_KEY,
      );

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="contact-page container section fade-in">
      <div className="section-header">
        <h1 className="gradient-text">Get In Touch</h1>
        <p>Have questions? I'd love to hear from you. Send a message and I'll respond as soon as possible.</p>
      </div>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="contact-form-wrapper glass">
          <h2 className="contact-section-title">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone (Optional)</label>
              <input
                type="text"
                name="phone"
                placeholder="+977 98XXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Message <span className="required">*</span></label>
              <textarea
                name="message"
                rows={6}
                placeholder="Tell me more about your inquiry..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary submit-button"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <>Sending... <Loader2 size={18} className="animate-spin" /></>
              ) : (
                <>Send Message <Send size={18} /></>
              )}
            </button>

            {status === 'success' && (
              <div className="status-msg success-msg">
                <CheckCircle2 size={18} /> Message sent successfully!
              </div>
            )}

            {status === 'error' && (
              <div className="status-msg error-msg">
                <AlertCircle size={18} /> {errorMessage}
              </div>
            )}
          </form>
        </div>

        {/* Contact Information & Sidebar */}
        <div className="contact-sidebar">
          <div className="info-card glass">
            <h2 className="sidebar-title">Contact Information</h2>
            
            <div className="info-list">
              <div className="info-item-box">
                <div className="info-icon-circle">
                  <Mail size={20} />
                </div>
                <div className="info-details">
                  <h4>Email</h4>
                  <a href="mailto:hello@johndoe.dev">leejaw.chitrakar10@gmail.com</a>
                </div>
              </div>

              <div className="info-item-box">
                <div className="info-icon-circle">
                  <Phone size={20} />
                </div>
                <div className="info-details">
                  <h4>Phone</h4>
                  <a href="tel:+9779841996363">+977 9841996363</a>
                </div>
              </div>

              <div className="info-item-box">
                <div className="info-icon-circle">
                  <MapPin size={20} />
                </div>
                <div className="info-details">
                  <h4>Location</h4>
                  <p>Kathmandu, Nepal</p>
                </div>
              </div>
            </div>

            <div className="social-box">
              <h3>Follow Me</h3>
              <div className="social-row">
                <a href="https://www.facebook.com/leejaw.chitrakar10" className="social-item fb" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
                <a href="https://www.instagram.com/leejawchitrakar" className="social-item ig" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
                <a href="https://www.linkedin.com/in/leejaw-chitrakar-254151313/" className="social-item ln" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
                <a href="https://github.com/Leejaw-Chitrakar" className="social-item gh" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Contact;
