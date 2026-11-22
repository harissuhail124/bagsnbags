import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Auth.css';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password }, { withCredentials: true });
      toast.success('Your password has been updated.');
      navigate('/account');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Invalid or expired token.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="badge" style={{ marginBottom: '8px' }}>Security</span>
          <h1 className="auth-title">Set New Password</h1>
          <p className="auth-desc">Enter your new credentials to regain access to your atelier account.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="new-pwd">New Password (Min. 8 chars)</label>
            <input
              id="new-pwd"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-pwd">Confirm New Password</label>
            <input
              id="confirm-pwd"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Return to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
