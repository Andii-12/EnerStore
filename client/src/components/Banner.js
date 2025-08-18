import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './Banner.css';

function Banner() {
  const [bannerData, setBannerData] = useState(null);

  useEffect(() => {
    // Fetch banner data if you have an endpoint, or use static data
    // For now, using static data
    setBannerData({
      title: "EnerStore - Эрчим хүчний тоног төхөөрөмж",
      subtitle: "Чанартай, найдвартай, хямд үнэтэй",
      buttonText: "Дэлгэрэнгүй",
      buttonLink: "/products"
    });
  }, []);

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