import React, { useState, useEffect, useCallback } from 'react';
import './Configurator.css';

const categories = [
  "Motherboards",
  "Processadores",
  "Placas Gráficas",
  "RAM",
  "Discos",
  "Fontes de Alimentação",
  "Caixas",
  "Monitores",
  "Teclados",
  "Ratos"
];

const Configurator = () => {
  const [selectedCategory, setSelectedCategory] = useState('Motherboards');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const addProduct = (product) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const removeProduct = (productToRemove) => {
    setSelectedProducts(selectedProducts.filter(product => product !== productToRemove));
  };

  const calculateTotals = useCallback(() => {
    const totalValue = selectedProducts.reduce((acc, product) => acc + (parseFloat(product.price) || 0), 0);
    const ivaValue = totalValue * 0.23;
    setIva(parseFloat(ivaValue.toFixed(2))); // Ensure two decimal places
    setTotal(parseFloat((totalValue + ivaValue).toFixed(2))); // Ensure two decimal places
  }, [selectedProducts]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [selectedProducts, calculateTotals]);

  return (
    <div className="configurator-container">
      <div className="categories">
        {categories.map((category) => (
          <button key={category} className={category === selectedCategory ? 'active' : ''} onClick={() => handleCategoryChange(category)}>
            {category}
          </button>
        ))}
      </div>
      <div className="configurator-content">
        <div className="product-list">
          {products.filter(product => product.category === selectedCategory).map((product) => (
            <div key={product.id} className="product-card">
              {product.image && <img src={product.image} alt={product.name} className="product-image" />}
              <h3>{product.name}</h3>
              <p>{product.price}€</p>
              <button onClick={() => addProduct(product)}>Adicionar</button>
            </div>
          ))}
        </div>
        <div className="summary">
          <h3>Lista Componentes</h3>
          <div className="selected-product-container">
            {selectedProducts.map((product, index) => (
              <div key={index} className="selected-product">
                <p>{product.name} - {product.price}€</p>
                <button onClick={() => removeProduct(product)}>Remover</button>
              </div>
            ))}
          </div>
          <p>IVA: {iva}€</p>
          <p>Total: {total}€</p>
        </div>
      </div>
    </div>
  );
};

export default Configurator;