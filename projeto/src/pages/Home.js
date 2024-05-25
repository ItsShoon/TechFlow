import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles
import './Home.css';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchNewArrivals();
    fetchFeatured();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/new-arrivals');
      const data = await response.json();
      setNewArrivals(data);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/featured');
      const data = await response.json();
      setFeatured(data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  return (
    <div className="home">
      <Navbar />
      <div className="promotions">
        <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false}>
          <div>
            <img src="/images/HomeCarousel/COOLER.jpg" alt="Slide 1" />
          </div>
          <div>
            <img src="/images/HomeCarousel/GPU.webp" alt="Slide 2" />
          </div>
          <div>
            <img src="/images/HomeCarousel/MONITOR.webp" alt="Slide 3" />
          </div>
        </Carousel>
      </div>
      <div className="new-arrivals">
        <h2>Novidades</h2>
        <div className="product-grid">
          {newArrivals.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>{product.manufacturer}</p>
              <p>{product.description}</p>
              <p>{product.price}€</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="featured">
        <h2>Destaques</h2>
        <div className="product-grid">
          {featured.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>{product.manufacturer}</p>
              <p>{product.description}</p>
              <p>{product.price}€</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;