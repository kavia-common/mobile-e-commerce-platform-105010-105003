import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

// PUBLIC_INTERFACE
const ProductCard = ({ product, showAddToCart = true }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, isInCart, getCartItem } = useCart();
  const { isAuthenticated } = useAuth();

  // PUBLIC_INTERFACE
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsAdding(true);
      addToCart(product, 1);
      
      // Show brief feedback
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  const inCart = isInCart(product.id);
  const cartItem = getCartItem(product.id);

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image-container">
          {!imageError ? (
            <img
              src={product.image || '/api/placeholder/300/300'}
              alt={product.name}
              className="product-image"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="product-image-placeholder">
              <span className="product-icon">📦</span>
            </div>
          )}
          
          {product.discount && (
            <div className="product-badge discount">
              -{product.discount}%
            </div>
          )}
          
          {product.isNew && (
            <div className="product-badge new">
              New
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
          
          {product.rating && (
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-value">({product.rating})</span>
            </div>
          )}
          
          <div className="product-price-container">
            <span className="product-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="product-original-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {showAddToCart && (
        <div className="product-actions">
          <button
            className={`btn btn-primary btn-full ${isAdding ? 'loading' : ''} ${inCart ? 'in-cart' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="spinner"></span>
                Adding...
              </>
            ) : inCart ? (
              <>
                ✓ In Cart ({cartItem?.quantity})
              </>
            ) : (
              <>
                <span className="cart-icon">🛒</span>
                Add to Cart
              </>
            )}
          </button>
          
          {!isAuthenticated && (
            <p className="auth-notice">
              <Link to="/login">Login</Link> for better experience
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
