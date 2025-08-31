import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProductDetailPage.css';

// PUBLIC_INTERFACE
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart, isInCart, getCartItem } = useCart();

  // PUBLIC_INTERFACE
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message);
      // Fallback to mock data for development
      setProduct(getMockProduct());
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Mock data for development
  const getMockProduct = () => ({
    id: parseInt(id),
    name: `Sample Product ${id}`,
    price: 99.99,
    originalPrice: 119.99,
    description: 'This is a detailed description of the product. It includes all the features, specifications, and benefits that make this product special.',
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ],
    rating: 4.5,
    reviewCount: 128,
    category: 'Electronics',
    brand: 'TechBrand',
    inStock: true,
    stockCount: 15,
    features: [
      'High-quality materials',
      'Fast shipping',
      '30-day return policy',
      'Warranty included'
    ],
    specifications: {
      'Dimensions': '10 x 8 x 2 inches',
      'Weight': '1.5 lbs',
      'Material': 'Premium plastic',
      'Color': 'Black',
      'Brand': 'TechBrand'
    }
  });

  // PUBLIC_INTERFACE
  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      addToCart(product, quantity);
      
      // Show brief feedback
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
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

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <div className="error-actions">
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Go Back
            </button>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inCart = isInCart(product.id);
  const cartItem = getCartItem(product.id);

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">→</span>
          <Link to="/products">Products</Link>
          <span className="separator">→</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images?.[selectedImage] || product.image || '/api/placeholder/600/600'}
                alt={product.name}
                className="product-image"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-meta">
                {product.brand && (
                  <span className="product-brand">by {product.brand}</span>
                )}
                {product.category && (
                  <span className="product-category">{product.category}</span>
                )}
              </div>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="product-rating">
                <div className="stars">
                  {renderStars(product.rating)}
                </div>
                <span className="rating-text">
                  {product.rating} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="product-pricing">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="discount">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.inStock ? (
                <span className="in-stock">
                  ✓ In Stock
                  {product.stockCount && ` (${product.stockCount} available)`}
                </span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            {/* Quantity and Actions */}
            {product.inStock && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="quantity-btn"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stockCount || 999}
                      className="quantity-input"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="quantity-btn"
                      disabled={product.stockCount && quantity >= product.stockCount}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`btn btn-primary btn-large ${inCart ? 'in-cart' : ''}`}
                  >
                    {isAddingToCart ? (
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
                        🛒 Add to Cart
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    className="btn btn-accent btn-large"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div className="product-specifications">
                <h3>Specifications</h3>
                <dl className="specs-list">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <dt>{key}:</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
