import React, { useEffect, useState, useRef } from 'react';
import './BrandCarousel.css';
import { useNavigate } from 'react-router-dom';

const VISIBLE_COUNT = 5;
const AUTO_SCROLL_DELAY = 5000;

function BrandCarousel() {
  const [brands, setBrands] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('');
  const [nextIdx, setNextIdx] = useState(null);
  const timerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data));
  }, []);

  useEffect(() => {
    if (!brands.length) return;
    timerRef.current = setTimeout(() => handleNext(), AUTO_SCROLL_DELAY);
    return () => clearTimeout(timerRef.current);
  }, [startIdx, brands.length]);

  const handleNext = () => {
    setDirection('right');
    setNextIdx((startIdx + VISIBLE_COUNT) % brands.length);
    setAnimating(true);
  };

  const handlePrev = () => {
    setDirection('left');
    setNextIdx((startIdx - VISIBLE_COUNT + brands.length) % brands.length);
    setAnimating(true);
  };

  const handleAnimationEnd = () => {
    if (nextIdx !== null) {
      setStartIdx(nextIdx);
      setNextIdx(null);
    }
    setAnimating(false);
  };

  if (!brands.length) return null;

  // Get visible brands (loop around)
  const idxToShow = nextIdx !== null ? nextIdx : startIdx;
  const visibleBrands = [];
  for (let i = 0; i < Math.min(VISIBLE_COUNT, brands.length); i++) {
    visibleBrands.push(brands[(idxToShow + i) % brands.length]);
  }

  const handleBrandClick = (brand) => {
    navigate(`/products?brand=${encodeURIComponent(brand.name)}`);
  };

  return (
    <div className="brand-carousel-container">
      <div className="brand-carousel-title">Брэндүүд</div>
      <div className="brand-carousel-slider-wrap">
        <button className="brand-carousel-arrow left" onClick={handlePrev}>&lt;</button>
        <div
          className={`brand-carousel brand-carousel-slider centered${animating ? ' animating ' + direction : ''}`}
          onAnimationEnd={handleAnimationEnd}
        >
          {visibleBrands.map(brand => (
            <div className="brand-carousel-item" key={brand._id} onClick={() => handleBrandClick(brand)} style={{ cursor: 'pointer' }}>
              {brand.logo && <img src={brand.logo} alt={brand.name} className="brand-carousel-logo" />}
              <div className="brand-carousel-name">{brand.name}</div>
            </div>
          ))}
        </div>
        <button className="brand-carousel-arrow right" onClick={handleNext}>&gt;</button>
      </div>
    </div>
  );
}

export default BrandCarousel; 