import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductGrid.css';

function ProductGrid({ products, loading = false }) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getSaleCountdown = (saleEnd) => {
    if (!saleEnd) return '';
    const now = new Date();
    const end = new Date(saleEnd);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} өдөр үлдлээ` : 'Дууссан';
  };

  const isOnSale = (product) => {
    if (!product.originalPrice || !product.saleEnd) return false;
    const now = new Date();
    const end = new Date(product.saleEnd);
    return product.price < product.originalPrice && end > now;
  };

  if (loading) {
    return (
      <div className="product-grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="product-card loading">
            <div className="product-image-container">
              <div className="product-image"></div>
            </div>
            <div className="product-info">
              <div className="product-specs"></div>
              <div className="product-name"></div>
              <div className="product-description"></div>
              <div className="price-section">
                <div className="current-price"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        color: '#666',
        fontSize: '16px'
      }}>
        Бүтээгдэхүүн олдсонгүй
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <div
          key={product._id}
          className="product-card"
          onClick={() => navigate(`/products/${product._id}`)}
        >
          {/* Sale Badge */}
          {isOnSale(product) && (
            <div className="sale-badge">
              -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
            </div>
          )}

          {/* Product Image */}
          <div className="product-image-container">
            <img
              src={product.image || product.thumbnail}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
          </div>

          {/* Product Info */}
          <div className="product-info">
            {/* Product Specs */}
            <div className="product-specs">
              {product.processor || product.spec || product.brand || ''}
            </div>

            {/* Product Name */}
            <div className="product-name">
              {product.name}
            </div>

            {/* Product Description */}
            <div className="product-description">
              {product.description}
            </div>

            {/* Company Info */}
            {product.company && (product.company.logo || product.company.name) && (
              <div className="company-info">
                {product.company.logo && (
                  <img
                    src={product.company.logo}
                    alt={product.company.name}
                    className="company-logo"
                  />
                )}
                <span className="company-name">
                  {product.company.name}
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="price-section">
              {isOnSale(product) ? (
                <>
                  <div className="original-price">
                    {formatPrice(product.originalPrice)} ₮
                  </div>
                  <div className="current-price">
                    {formatPrice(product.price)} ₮
                    <span className="discount-percent">
                      -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
                    </span>
                  </div>
                  <div className="sale-countdown">
                    {getSaleCountdown(product.saleEnd)}
                  </div>
                </>
              ) : (
                <div className="current-price">
                  {formatPrice(product.price)} ₮
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid; 