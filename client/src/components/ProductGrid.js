import React from 'react';
import './ProductGrid.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ProductGrid({ products }) {
  const navigate = useNavigate();
  // Remove cart and favorite state and handlers
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '28px',
      width: '100%',
      maxWidth: 1400,
      margin: '0 auto',
    }}>
      {products.slice(0, 16).map(product => {
        const onSale = product.originalPrice && product.price < product.originalPrice;
        const salePercent = onSale ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;
        const daysLeft = product.saleEnd ? (() => {
          const now = new Date();
          const end = new Date(product.saleEnd);
          const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
          return diff > 0 ? diff : 0;
        })() : null;
        return (
          <div
            className="product-card"
            key={product._id}
            style={{
              background: '#fff',
              border: '1.5px solid #f0f0f0',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(8,15,70,0.06)',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              minHeight: 380,
              position: 'relative',
              cursor: 'pointer',
              transition: 'box-shadow 0.18s, border 0.18s',
              width: '100%',
              maxWidth: 320,
              margin: '0 auto',
              overflow: 'hidden',
            }}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            {/* Top row: brand logo and discount badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 12px 0 12px', minHeight: 36 }}>
              {product.brandLogo && (
                <img src={product.brandLogo} alt={product.brand || 'brand'} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', background: '#fff', border: '1.5px solid #eee' }} />
              )}
              {onSale && (
                <div style={{ background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 6, padding: '2px 12px', marginLeft: 'auto' }}>-{salePercent}%</div>
              )}
            </div>
            {/* Product image */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 140, margin: '8px 0 0 0' }}>
              <img
                src={product.image || product.thumbnail}
                alt={product.name}
                style={{ width: 160, height: 120, objectFit: 'contain', borderRadius: 8, background: '#f8f8f8' }}
              />
            </div>
            {/* Sale bar */}
            {onSale && daysLeft !== null && daysLeft > 0 && (
              <div style={{ background: '#22c55e', color: '#fff', fontWeight: 600, fontSize: 15, borderRadius: 4, padding: '4px 10px', margin: '12px 12px 0 12px', textAlign: 'center' }}>
                Хямдрал дуусахад {daysLeft} өдөр
              </div>
            )}
            {/* Specs */}
            <div style={{ color: '#888', fontSize: 15, fontWeight: 500, margin: '12px 12px 0 12px', minHeight: 18 }}>
              {product.processor || product.spec || ''}
            </div>
            {/* Name */}
            <div style={{ fontWeight: 700, fontSize: 17, color: '#222', margin: '8px 12px 0 12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: 24 }}>
              {product.name}
            </div>
            {/* Description */}
            {product.description && (
              <div style={{ color: '#666', fontSize: 14, margin: '6px 12px 0 12px', minHeight: 18, maxHeight: 22, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {product.description.length > 60 ? product.description.slice(0, 60) + '...' : product.description}
              </div>
            )}
            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 12px 0 12px', minHeight: 28, justifyContent: onSale ? 'space-between' : 'flex-start' }}>
              {onSale ? (
                <>
                  <span style={{ color: '#888', fontWeight: 600, fontSize: 16, textDecoration: 'line-through' }}>
                    {new Intl.NumberFormat('mn-MN').format(product.originalPrice)} ₮
                  </span>
                  <span style={{ color: '#f8991b', fontWeight: 700, fontSize: 22, marginLeft: 'auto' }}>
                    {new Intl.NumberFormat('mn-MN').format(product.price)} ₮
                  </span>
                </>
              ) : (
                <span style={{ color: '#f8991b', fontWeight: 700, fontSize: 22 }}>
                  {new Intl.NumberFormat('mn-MN').format(product.price)} ₮
                </span>
              )}
            </div>
            {/* Publisher (company) logo and name */}
            {product.companyLogo || product.companyName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 12px 10px 12px', minHeight: 28 }}>
                {product.companyLogo && (
                  <img src={product.companyLogo} alt={product.companyName || 'company'} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', background: '#fff', border: '1.5px solid #eee' }} />
                )}
                {product.companyName && (
                  <span style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>{product.companyName}</span>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default ProductGrid; 