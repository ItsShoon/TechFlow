import React from 'react';
import './ProductSection.css';

const ProductSection = ({ title, products }) => {
  return (
    <div className="product-section">
      <h2>{title}</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <p>{product}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
