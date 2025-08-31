import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './OrderHistoryPage.css';

// PUBLIC_INTERFACE
const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check for success parameter (from checkout)
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // PUBLIC_INTERFACE
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      // Fallback to mock data for development
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch orders on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  // Mock data for development
  const getMockOrders = () => [
    {
      id: 'ORD-001',
      orderNumber: '#1001',
      date: '2024-01-15',
      status: 'delivered',
      total: 149.99,
      items: [
        { id: 1, name: 'Wireless Headphones', quantity: 1, price: 99.99, image: '/api/placeholder/80/80' },
        { id: 2, name: 'USB Cable', quantity: 2, price: 25.00, image: '/api/placeholder/80/80' }
      ],
      shipping: {
        method: 'Standard Shipping',
        address: '123 Main St, Anytown, ST 12345'
      }
    },
    {
      id: 'ORD-002',
      orderNumber: '#1002',
      date: '2024-01-10',
      status: 'shipped',
      total: 79.99,
      items: [
        { id: 3, name: 'Bluetooth Speaker', quantity: 1, price: 79.99, image: '/api/placeholder/80/80' }
      ],
      shipping: {
        method: 'Express Shipping',
        address: '123 Main St, Anytown, ST 12345'
      },
      tracking: 'TRK123456789'
    },
    {
      id: 'ORD-003',
      orderNumber: '#1003',
      date: '2024-01-05',
      status: 'processing',
      total: 299.99,
      items: [
        { id: 4, name: 'Smart Watch', quantity: 1, price: 299.99, image: '/api/placeholder/80/80' }
      ],
      shipping: {
        method: 'Standard Shipping',
        address: '123 Main St, Anytown, ST 12345'
      }
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '⏳';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Order History</h1>
          <p className="page-description">Track and manage your orders</p>
        </div>

        {showSuccess && (
          <div className="success-alert">
            🎉 Order placed successfully! Thank you for your purchase.
          </div>
        )}

        {error && (
          <div className="error-state">
            <p className="error-message">Unable to load orders. Please try again.</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              Retry
            </button>
          </div>
        )}

        {!error && (
          <>
            {orders.length > 0 ? (
              <div className="orders-content">
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3 className="order-number">{order.orderNumber}</h3>
                          <p className="order-date">Ordered on {formatDate(order.date)}</p>
                        </div>
                        <div className="order-status">
                          <span className={`status-badge ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="order-items">
                        {order.items.map(item => (
                          <div key={item.id} className="order-item">
                            <img 
                              src={item.image || '/api/placeholder/60/60'} 
                              alt={item.name}
                              className="item-image"
                            />
                            <div className="item-details">
                              <Link 
                                to={`/products/${item.id}`} 
                                className="item-name"
                              >
                                {item.name}
                              </Link>
                              <p className="item-quantity">Qty: {item.quantity}</p>
                            </div>
                            <div className="item-price">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer">
                        <div className="order-total">
                          <strong>Total: {formatPrice(order.total)}</strong>
                        </div>
                        <div className="order-actions">
                          <button
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                            className="btn btn-outline btn-small"
                          >
                            {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                          </button>
                          {order.status === 'delivered' && (
                            <Link 
                              to={`/products?reorder=${order.id}`}
                              className="btn btn-primary btn-small"
                            >
                              Reorder
                            </Link>
                          )}
                          {order.tracking && (
                            <button className="btn btn-secondary btn-small">
                              Track Package
                            </button>
                          )}
                        </div>
                      </div>

                      {selectedOrder === order.id && (
                        <div className="order-details">
                          <div className="details-section">
                            <h4>Shipping Information</h4>
                            <p className="shipping-method">{order.shipping.method}</p>
                            <p className="shipping-address">{order.shipping.address}</p>
                            {order.tracking && (
                              <p className="tracking-number">
                                <strong>Tracking Number:</strong> {order.tracking}
                              </p>
                            )}
                          </div>
                          
                          <div className="details-section">
                            <h4>Order Summary</h4>
                            <div className="summary-lines">
                              <div className="summary-line">
                                <span>Subtotal:</span>
                                <span>{formatPrice(order.total * 0.85)}</span>
                              </div>
                              <div className="summary-line">
                                <span>Shipping:</span>
                                <span>{formatPrice(order.total * 0.07)}</span>
                              </div>
                              <div className="summary-line">
                                <span>Tax:</span>
                                <span>{formatPrice(order.total * 0.08)}</span>
                              </div>
                              <div className="summary-line total">
                                <span><strong>Total:</strong></span>
                                <span><strong>{formatPrice(order.total)}</strong></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="orders-sidebar">
                  <div className="sidebar-card">
                    <h3>Need Help?</h3>
                    <p>Questions about your order? We're here to help.</p>
                    <button className="btn btn-outline btn-full">
                      Contact Support
                    </button>
                  </div>
                  
                  <div className="sidebar-card">
                    <h3>Return Policy</h3>
                    <p>Not satisfied with your purchase? You can return most items within 30 days.</p>
                    <Link to="/returns" className="btn btn-ghost btn-full">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h2>No Orders Yet</h2>
                <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
                <Link to="/products" className="btn btn-primary btn-large">
                  Start Shopping
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
