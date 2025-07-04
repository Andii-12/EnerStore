import React from 'react';
import './Banner.css';

function Banner() {
  return (
    <div className="main-banner">
      <div className="banner-content">
        <div className="banner-title">Хурд Хүч Хямдралт</div>
        <div className="banner-sub">ХЯМДРАЛТАЙ ХУДАЛДАА</div>
      </div>
      <img className="banner-img" src="https://bestcomputers.mn/images/banner/enerstore-demo.png" alt="banner" />
    </div>
  );
}

export default Banner; 