import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProfilePage.css';

// PUBLIC_INTERFACE
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'United States'
      });
    }
  }, [user]);

  // PUBLIC_INTERFACE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // PUBLIC_INTERFACE
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    return errors;
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleCancel = () => {
    // Reset form data to user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'United States'
      });
    }
    setFormErrors({});
    setError(null);
    setIsEditing(false);
  };

  // PUBLIC_INTERFACE
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
      navigate('/');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-description">Manage your account information</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
            </div>

            <nav className="profile-nav">
              <button className="nav-item active">
                👤 Personal Information
              </button>
              <button 
                className="nav-item"
                onClick={() => navigate('/orders')}
              >
                📋 Order History
              </button>
              <button 
                className="nav-item logout"
                onClick={handleLogout}
              >
                🚪 Sign Out
              </button>
            </nav>
          </div>

          <div className="profile-main">
            <div className="profile-card">
              <div className="card-header">
                <h2>Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {success && (
                <div className="success-alert">
                  Profile updated successfully!
                </div>
              )}

              {error && (
                <div className="error-alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                      disabled={!isEditing || loading}
                      readOnly={!isEditing}
                    />
                    {formErrors.firstName && (
                      <div className="form-error">{formErrors.firstName}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                      disabled={!isEditing || loading}
                      readOnly={!isEditing}
                    />
                    {formErrors.lastName && (
                      <div className="form-error">{formErrors.lastName}</div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                    disabled={!isEditing || loading}
                    readOnly={!isEditing}
                  />
                  {formErrors.email && (
                    <div className="form-error">{formErrors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.phone ? 'error' : ''}`}
                    disabled={!isEditing || loading}
                    readOnly={!isEditing}
                    placeholder={!isEditing && !formData.phone ? 'Not provided' : ''}
                  />
                  {formErrors.phone && (
                    <div className="form-error">{formErrors.phone}</div>
                  )}
                </div>

                <div className="form-section">
                  <h3>Address Information</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={!isEditing || loading}
                      readOnly={!isEditing}
                      placeholder={!isEditing && !formData.address ? 'Not provided' : ''}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={!isEditing || loading}
                        readOnly={!isEditing}
                        placeholder={!isEditing && !formData.city ? 'Not provided' : ''}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={!isEditing || loading}
                        readOnly={!isEditing}
                        placeholder={!isEditing && !formData.state ? 'Not provided' : ''}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={!isEditing || loading}
                        readOnly={!isEditing}
                        placeholder={!isEditing && !formData.zipCode ? 'Not provided' : ''}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={!isEditing || loading}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-secondary"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
