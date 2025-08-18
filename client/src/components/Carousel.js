import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './Carousel.css';

function Carousel() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState('');

  useEffect(() => {
    fetch(API_ENDPOINTS.CAROUSEL)
      .then(res => res.json())
      .then(data => {
        setSlides(data);
        setLoading(false);
      });
  }, []);

  // Auto-slide every 10 seconds
  useEffect(() => {
    if (!slides.length) return;
    const timer = setTimeout(() => {
      setDirection('right');
      setCurrent((current + 1) % slides.length);
    }, 10000);
    return () => clearTimeout(timer);
  }, [current, slides.length]);

  const nextSlide = () => {
    setDirection('right');
    setCurrent((current + 1) % slides.length);
  };
  const prevSlide = () => {
    setDirection('left');
    setCurrent((current - 1 + slides.length) % slides.length);
  };

  if (loading) return <div className="carousel" style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Уншиж байна...</div>;
  if (!slides.length) return <div className="carousel" style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Карусель хоосон байна</div>;

  return (
    <div className="carousel modern-carousel">
      <button className="carousel-btn left" onClick={prevSlide}>&lt;</button>
      <div className={`carousel-slide slide-animate ${direction}`} onAnimationEnd={() => setDirection('')}>
        <img src={slides[current].image} alt={slides[current].title} className="carousel-img full-bg" />
        <div className="carousel-overlay" />
        <div className="carousel-caption">
          <h2>{slides[current].title}</h2>
          <p>{slides[current].subtitle}</p>
        </div>
      </div>
      <button className="carousel-btn right" onClick={nextSlide}>&gt;</button>
    </div>
  );
}

export default Carousel; 