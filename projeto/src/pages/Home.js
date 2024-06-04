import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignProducts, setCampaignProducts] = useState({});

  useEffect(() => {
    fetchCampaigns();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (campaigns.length > 0) {
      campaigns.forEach(campaign => {
        fetchCampaignProducts(campaign.id);
      });
    }
  }, [campaigns]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns');
      const data = await response.json();
      const activeCampaigns = data.filter(campaign => campaign.active);
      setCampaigns(activeCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchCampaignProducts = async (campaignId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/campaign-products/${campaignId}`);
      const data = await response.json();
      setCampaignProducts(prevState => ({
        ...prevState,
        [campaignId]: data
      }));
    } catch (error) {
      console.error(`Error fetching products for campaign ${campaignId}:`, error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2);
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
      {campaigns.map(campaign => (
        <div key={campaign.id} className="campaign-container-home">
          <h2>{campaign.name}</h2>
          <div className="campaign-products-home">
            {campaignProducts[campaign.id] && campaignProducts[campaign.id].map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <h3>{product.name}</h3>
                <p>{product.manufacturer}</p>
                <p>{product.description}</p>
                <p>Preço Original: {product.price}€</p>
                <p>Preço com Desconto: {calculateDiscountedPrice(product.price, campaign.discount)}€</p>
                <p>Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Footer />
    </div>
  );
};

export default Home;