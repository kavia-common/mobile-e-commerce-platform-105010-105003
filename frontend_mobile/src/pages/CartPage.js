import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

// PUBLIC_INTERFACE
const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [isClearing, setIsClearing] = useState(false);

  // PUBLIC_INTERFACE
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // PUBLIC_INTERFACE
  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      clearCart();
    } finally {
      setIsClearing(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Shopping Cart</h1>
          </div>
          
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Start shopping to add items to your cart</p>
            <Link to="/products" className="btn btn-primary btn-large">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-header">
              <h2>Items in your cart</h2>
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="clear-cart-btn"
              >
                {isClearing ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>

            <div className="items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <Link to={`/products/${item.id}`}>
                      <img
                        src={item.image || '/api/placeholder/150/150'}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/api/placeholder/150/150';
                        }}
                      />
                    </Link>
                  </div>

                  <div className="item-details">
                    <Link to={`/products/${item.id}`} className="item-name">
                      {item.name}
                    </Link>
                    
                    {item.description && (
                      <p className="item-description">{item.description}</p>
                    )}
                    
                    <div className="item-price">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={loading}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                        className="quantity-input"
                        disabled={loading}
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="quantity-btn"
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                      disabled={loading}
                      aria-label="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="summary-line">
                <span>Shipping:</span>
                <span>
                  {shipping > 0 ? formatPrice(shipping) : 'FREE'}
                </span>
              </div>
              
              {shipping > 0 && (
                <div className="shipping-note">
                  Free shipping on orders over $50
                </div>
              )}
              
              <div className="summary-line">
                <span>Tax:</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              <div className="summary-line total">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="checkout-actions">
                <button
                  onClick={handleCheckout}
                  className="btn btn-primary btn-large btn-full"
                  disabled={loading}
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
                
                <Link to="/products" className="continue-shopping">
                  ← Continue Shopping
                </Link>
              </div>

              {!isAuthenticated && (
                <div className="auth-notice">
                  <p>
                    <Link to="/login">Sign in</Link> to checkout faster or{' '}
                    <Link to="/register">create an account</Link>
                  </p>
                </div>
              )}
            </div>

            {/* Security Info */}
            <div className="security-info">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span>Secure Checkout</span>
              </div>
              <div className="security-item">
                <span className="security-icon">↩️</span>
                <span>30-Day Returns</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🚚</span>
                <span>Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
