import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

// PUBLIC_INTERFACE
const Header = ({ theme, onThemeToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = getCartItemCount();

  // PUBLIC_INTERFACE
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // PUBLIC_INTERFACE
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // PUBLIC_INTERFACE
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return '🌙';
    if (theme === 'dark') return '☀️';
    return '🔄';
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Dark';
    if (theme === 'dark') return 'Auto';
    return 'Light';
  };

  const isActivePage = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-icon">🛒</span>
            <span className="logo-text">ShopMobile</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link 
              to="/" 
              className={`nav-link ${isActivePage('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`nav-link ${isActivePage('/products') ? 'active' : ''}`}
            >
              Products
            </Link>
            {user && (
              <Link 
                to="/orders" 
                className={`nav-link ${isActivePage('/orders') ? 'active' : ''}`}
              >
                Orders
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Theme Toggle */}
            <button 
              className="theme-toggle"
              onClick={onThemeToggle}
              aria-label={`Switch to ${getThemeLabel()} mode`}
            >
              <span className="theme-icon">{getThemeIcon()}</span>
              <span className="theme-label">{getThemeLabel()}</span>
            </button>

            {/* Cart */}
            <Link to="/cart" className="cart-button">
              <span className="cart-icon">🛒</span>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="user-menu">
                <Link to="/profile" className="user-button">
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user.name}</span>
                </Link>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost btn-small">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-small">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <span className="menu-icon">
                {isMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-mobile-content">
            <Link 
              to="/" 
              className={`nav-link ${isActivePage('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">🏠</span>
              Home
            </Link>
            <Link 
              to="/products" 
              className={`nav-link ${isActivePage('/products') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">📦</span>
              Products
            </Link>
            <Link 
              to="/cart" 
              className={`nav-link ${isActivePage('/cart') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">🛒</span>
              Cart
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActivePage('/profile') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="nav-icon">👤</span>
                  Profile
                </Link>
                <Link 
                  to="/orders" 
                  className={`nav-link ${isActivePage('/orders') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="nav-icon">📋</span>
                  Orders
                </Link>
                <button className="nav-link logout-mobile" onClick={handleLogout}>
                  <span className="nav-icon">🚪</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActivePage('/login') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="nav-icon">🔐</span>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`nav-link ${isActivePage('/register') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="nav-icon">📝</span>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="nav-overlay" onClick={closeMenu}></div>
        )}
      </div>
    </header>
  );
};

export default Header;
