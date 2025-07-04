import React from 'react';
import './CategoryGrid.css';
import { useNavigate } from 'react-router-dom';

function CategoryGrid({ categories }) {
  const navigate = useNavigate();
  const handleCategoryClick = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat.name)}`);
  };
  return (
    <div className="category-grid">
      {categories.map((cat, idx) => (
        <div className="category-item" key={cat._id || idx} onClick={() => handleCategoryClick(cat)} style={{ cursor: 'pointer' }}>
          <img src={cat.image} alt={cat.name} className="category-img" />
          <div className="category-label">{cat.name}</div>
        </div>
      ))}
    </div>
  );
}

export default CategoryGrid; 