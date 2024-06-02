import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryProducts.css';

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  const fetchProductsByCategory = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/category/${category}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [category]);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  return (
    <div>
      <h2>Products in {category}</h2>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            {product.image && <img src={product.image} alt={product.name} className="product-image" />}
            <h3>{product.name}</h3>
            <p>{product.manufacturer}</p>
            <p>{product.description}</p>
            <p>{product.price}€</p>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;