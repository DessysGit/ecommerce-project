// UserProfile component - displays and manages user account information
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

function UserProfile() {
  const navigate = useNavigate();
  const { token, user, setUser } = useAuth();

  // State for profile data
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    order_count: 0,
    created_at: ''
  });

  // State for edit mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  // State for password change
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setProfileData(response.data);
      setEditedProfile({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile');
      setLoading(false);
    }
  };

  // Handle profile edit input changes
  const handleProfileChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value
    });
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setError('');
      setSuccessMessage('');

      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        editedProfile,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setProfileData({
        ...profileData,
        ...response.data.user
      });
      
      // Update user in auth context
      setUser(response.data.user);
      
      setIsEditingProfile(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  // Cancel profile edit
  const handleCancelEdit = () => {
    setEditedProfile({
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      email: profileData.email
    });
    setIsEditingProfile(false);
    setError('');
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await axios.put(
        'http://localhost:5000/api/auth/password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setSuccessMessage('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="user-profile-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Products
      </button>

      <h2>My Account</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="profile-container">
        {/* Account Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <h3>Account Information</h3>
            {!isEditingProfile && (
              <button 
                className="edit-btn"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit
              </button>
            )}
          </div>

          {isEditingProfile ? (
            // Edit Mode
            <div className="profile-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={editedProfile.first_name}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={editedProfile.last_name}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-actions">
                <button className="save-btn" onClick={handleSaveProfile}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">
                  {profileData.first_name} {profileData.last_name}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{profileData.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {formatDate(profileData.created_at)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Account Statistics */}
        <div className="profile-section">
          <h3>Account Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{profileData.order_count}</div>
              <div className="stat-label">Orders Placed</div>
            </div>
            <div className="stat-card clickable" onClick={() => navigate('/orders')}>
              <div className="stat-icon">📦</div>
              <div className="stat-label">View Order History</div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="profile-section">
          <div className="section-header">
            <h3>Password & Security</h3>
            {!isChangingPassword && (
              <button 
                className="edit-btn"
                onClick={() => {
                  setIsChangingPassword(true);
                  setError('');
                }}
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form className="password-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Change Password
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setError('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="password-info">
              <p>••••••••</p>
              <p className="password-hint">
                Keep your password secure and change it regularly
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
