import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryProducts.css';

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProductsByCategory();
  }, [category]);

  const fetchProductsByCategory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/category/${category}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="category-products-container">
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.manufacturer}</p>
              <p>{product.price}€</p>
              <p>Stock: {product.stock}</p>
            </div>
            <button className="btn">Adicionar ao Carrinho</button>
            <button className="btn buy-now">Comprar Já</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;