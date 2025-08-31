import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProductsPage.css';

// PUBLIC_INTERFACE
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  const categories = useMemo(() => [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books' },
    { value: 'toys', label: 'Toys & Games' }
  ], []);

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: '$200+' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Mock data for development
  const getMockProducts = useCallback(() => {
    const mockProducts = [];
    for (let i = 1; i <= productsPerPage; i++) {
      mockProducts.push({
        id: (currentPage - 1) * productsPerPage + i,
        name: `Product ${(currentPage - 1) * productsPerPage + i}`,
        price: Math.floor(Math.random() * 200) + 10,
        image: '/api/placeholder/300/300',
        rating: Math.floor(Math.random() * 50) / 10,
        description: `This is a great product with amazing features and quality.`,
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].value
      });
    }
    return mockProducts;
  }, [currentPage, productsPerPage, categories]);

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: productsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(priceRange && { price: priceRange }),
        ...(sortBy && { sort: sortBy })
      });

      const response = await fetch(`/api/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      // Fallback to mock data for development
      setProducts(getMockProducts());
      setTotalPages(3);
      setTotalProducts(36);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, priceRange, sortBy, getMockProducts]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (priceRange) params.set('price', priceRange);
    if (sortBy && sortBy !== 'name') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, priceRange, sortBy, currentPage, setSearchParams]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange, sortBy]);



  // PUBLIC_INTERFACE
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  // PUBLIC_INTERFACE
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange('');
    setSortBy('name');
    setCurrentPage(1);
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Products</h1>
          <p className="page-description">
            Discover our amazing collection of products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </div>
          </form>

          <div className="filters-container">
            <div className="filter-group">
              <label className="filter-label">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price:</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="filter-select"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleClearFilters}
              className="clear-filters-button"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        {!loading && !error && (
          <div className="results-summary">
            <p>
              Showing {products.length} of {totalProducts} products
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner message="Loading products..." />}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <p className="error-message">
              Unable to load products. Please try again.
            </p>
            <button onClick={fetchProducts} className="btn btn-primary">
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    showAddToCart={true}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <button onClick={handleClearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  ← Previous
                </button>
                
                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 2;
                    
                    if (!showPage) {
                      if (page === currentPage - 3 || page === currentPage + 3) {
                        return <span key={page} className="pagination-ellipsis">...</span>;
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-number ${isCurrentPage ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
