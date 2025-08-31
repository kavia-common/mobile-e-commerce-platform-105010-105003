import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './HomePage.css';

// PUBLIC_INTERFACE
const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products/featured');
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      
      const data = await response.json();
      setFeaturedProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setError(error.message);
      // Fallback to mock data for development
      setFeaturedProducts(getMockFeaturedProducts());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Mock data for development
  const getMockFeaturedProducts = () => [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      description: 'High-quality wireless headphones with noise cancellation'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      description: 'Advanced smartwatch with health monitoring features'
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 79.99,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      description: 'Portable Bluetooth speaker with excellent sound quality'
    },
    {
      id: 4,
      name: 'Smartphone Case',
      price: 29.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      description: 'Durable smartphone case with premium materials'
    }
  ];

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to <span className="text-primary">ShopMobile</span>
              </h1>
              <p className="hero-description">
                Discover amazing products at unbeatable prices. 
                Shop from the comfort of your mobile device with our 
                modern, fast, and secure e-commerce platform.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary btn-large">
                  Shop Now
                </Link>
                <Link to="/products?category=featured" className="btn btn-outline btn-large">
                  View Featured
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-placeholder">
                <span className="hero-icon">🛍️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Fast Shipping</h3>
              <p className="feature-description">
                Get your orders delivered quickly with our expedited shipping options.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Payments</h3>
              <p className="feature-description">
                Shop with confidence using our secure payment processing system.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Our customer support team is available around the clock to help you.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3 className="feature-title">Easy Returns</h3>
              <p className="feature-description">
                Not satisfied? Return your items hassle-free within 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-description">
              Check out our handpicked selection of amazing products
            </p>
            <Link to="/products" className="section-link">
              View All Products →
            </Link>
          </div>

          {error && (
            <div className="error-message">
              <p>Unable to load featured products. Please try again later.</p>
              <button onClick={fetchFeaturedProducts} className="btn btn-primary">
                Retry
              </button>
            </div>
          )}

          {!error && (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  showAddToCart={true}
                />
              ))}
            </div>
          )}

          {!error && featuredProducts.length === 0 && !loading && (
            <div className="empty-state">
              <p>No featured products available at the moment.</p>
              <Link to="/products" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Shopping?</h2>
            <p className="cta-description">
              Join thousands of satisfied customers and discover 
              your next favorite product today.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-accent btn-large">
                Create Account
              </Link>
              <Link to="/products" className="btn btn-outline btn-large">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
