import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/api/contact', formData);
      setSubmitted(true);
      toast.success('Your message has been sent to our atelier.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Could not send message. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0 var(--space-12)', maxWidth: '720px' }}>
      <span className="badge" style={{ marginBottom: '8px' }}>Concierge Desk</span>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginBottom: 'var(--space-2)' }}>
        Contact the Atelier
      </h1>
      <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.95rem', marginBottom: 'var(--space-6)' }}>
        For inquiries regarding sizing, leather conditioning, bulk corporate editions, or existing orders, please send us a note below.
      </p>

      {submitted ? (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px' }}>
            Message Received
          </h3>
          <p style={{ color: 'var(--color-secondary-text)', marginBottom: '20px' }}>
            Thank you for reaching out. One of our workshop specialists will reply within one business day.
          </p>
          <button className="btn btn-outline btn-sm" onClick={() => setSubmitted(false)}>
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <div className="form-group">
            <label htmlFor="contact-name">Full Name *</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Julian Vance"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">Email Address *</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="julian@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject">Inquiry Subject</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              placeholder="e.g. Leather Care Advice / Order #1234"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-msg">Message *</label>
            <textarea
              id="contact-msg"
              name="message"
              rows="5"
              placeholder="Please provide specifics on your inquiry..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? 'Dispatching Message...' : 'Send Inquiry'}
          </button>
        </form>
      )}
    </div>
  );
}
