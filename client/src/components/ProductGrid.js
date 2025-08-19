import React from 'react';
import './ProductGrid.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ProductGrid({ products }) {
  const navigate = useNavigate();
  
  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getSaleInfo = (product) => {
    if (!product.originalPrice || product.price >= product.originalPrice) return null;
    
    const discountPercent = Math.round(100 - (product.price / product.originalPrice) * 100);
    let daysLeft = null;
    
    if (product.saleEnd) {
      const now = new Date();
      const end = new Date(product.saleEnd);
      const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      daysLeft = diff > 0 ? diff : 0;
    }
    
    return { discountPercent, daysLeft };
  };

  return (
    <div className="product-grid">
      {products.map(product => {
        const saleInfo = getSaleInfo(product);
        const onSale = saleInfo !== null;
        
        return (
          <div
            className="product-card"
            key={product._id}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            {/* Product Image Container */}
            <div className="product-image-container">
              <img
                src={product.image || product.thumbnail}
                alt={product.name}
                className="product-image"
              />
              {/* Sale Badge */}
              {onSale && (
                <div className="sale-badge">
                  -{saleInfo.discountPercent}%
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="product-info">
              {/* Product Specs */}
              {(product.processor || product.spec) && (
                <div className="product-specs">
                  {product.processor || product.spec}
                </div>
              )}
              
              {/* Product Name */}
              <div className="product-name">
                {product.name}
              </div>
              
              {/* Product Description */}
              {product.description && (
                <div className="product-description">
                  {product.description}
                </div>
              )}
              
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
                {onSale ? (
                  <>
                    <span className="original-price">
                      {formatPrice(product.originalPrice)} ₮
                    </span>
                    <div className="current-price">
                      {formatPrice(product.price)} ₮
                      <span className="discount-percent">
                        -{saleInfo.discountPercent}%
                      </span>
                    </div>
                    {saleInfo.daysLeft > 0 && (
                      <div className="sale-countdown">
                        Хямдрал дуусахад {saleInfo.daysLeft} өдөр
                      </div>
                    )}
                  </>
                ) : (
                  <div className="current-price">
                    {formatPrice(product.price)} ₮
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductGrid; 