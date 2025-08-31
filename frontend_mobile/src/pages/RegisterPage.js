import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

// PUBLIC_INTERFACE
const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isAuthenticated, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  // PUBLIC_INTERFACE
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
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
    
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      // Remove confirmPassword from the data sent to backend
      const { confirmPassword, agreeToTerms, ...userData } = formData;
      
      const result = await register(userData);
      
      if (result.success) {
        navigate(redirectUrl);
      } else {
        setFormErrors({ general: result.error });
      }
    } catch (error) {
      setFormErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-container">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join us and start shopping today</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {(error || formErrors.general) && (
              <div className="error-alert">
                {error || formErrors.general}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                  placeholder="Enter your first name"
                  disabled={loading || isSubmitting}
                />
                {formErrors.firstName && (
                  <div className="form-error">{formErrors.firstName}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                  placeholder="Enter your last name"
                  disabled={loading || isSubmitting}
                />
                {formErrors.lastName && (
                  <div className="form-error">{formErrors.lastName}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                disabled={loading || isSubmitting}
              />
              {formErrors.email && (
                <div className="form-error">{formErrors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${formErrors.phone ? 'error' : ''}`}
                placeholder="Enter your phone number"
                disabled={loading || isSubmitting}
              />
              {formErrors.phone && (
                <div className="form-error">{formErrors.phone}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${formErrors.password ? 'error' : ''}`}
                placeholder="Create a password"
                disabled={loading || isSubmitting}
              />
              {formErrors.password && (
                <div className="form-error">{formErrors.password}</div>
              )}
              <div className="password-hint">
                Password must be at least 6 characters with uppercase, lowercase, and number
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
                disabled={loading || isSubmitting}
              />
              {formErrors.confirmPassword && (
                <div className="form-error">{formErrors.confirmPassword}</div>
              )}
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="checkbox-input"
                  disabled={loading || isSubmitting}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  I agree to the{' '}
                  <Link to="/terms" className="link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="link">Privacy Policy</Link>
                </span>
              </label>
              {formErrors.agreeToTerms && (
                <div className="form-error">{formErrors.agreeToTerms}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="btn btn-primary btn-large btn-full"
            >
              {loading || isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link 
                to={`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                className="auth-link"
              >
                Sign In
              </Link>
            </p>
            
            <div className="divider">
              <span>or</span>
            </div>
            
            <Link to="/" className="btn btn-ghost btn-full">
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
