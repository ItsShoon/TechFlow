import React, { useState, useEffect } from 'react';
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

const initialProducts = [
  { id: 1, name: "Motherboard ASUS", category: "Motherboards", price: 100 },
  { id: 2, name: "Intel Core i9", category: "Processadores", price: 400 },
  { id: 3, name: "NVIDIA GTX 3080", category: "Placas Gráficas", price: 800 },
  { id: 4, name: "Corsair 16GB RAM", category: "RAM", price: 150 },
  { id: 5, name: "Samsung SSD 1TB", category: "Discos", price: 120 },
  { id: 6, name: "Corsair PSU 750W", category: "Fontes de Alimentação", price: 90 },
  { id: 7, name: "Cooler Master Case", category: "Caixas", price: 70 },
  { id: 8, name: "Dell 27' Monitor", category: "Monitores", price: 300 },
  { id: 9, name: "Logitech Keyboard", category: "Teclados", price: 80 },
  { id: 10, name: "Razer Mouse", category: "Ratos", price: 60 },
];

const Configurator = () => {
  const [selectedCategory, setSelectedCategory] = useState('Motherboards');
  const [products, setProducts] = useState(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [selectedProducts]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const addProduct = (product) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const removeProduct = (productToRemove) => {
    setSelectedProducts(selectedProducts.filter(product => product !== productToRemove));
  };

  const calculateTotals = () => {
    const totalValue = selectedProducts.reduce((acc, product) => acc + product.price, 0);
    const ivaValue = totalValue * 0.23;
    setIva(ivaValue);
    setTotal(totalValue + ivaValue);
  };

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
              <h3>{product.name}</h3>
              <p>{product.price}€</p>
              {product.image && <img src={product.image} alt={product.name} className="product-image" />}
              <button onClick={() => addProduct(product)}>Adicionar</button>
            </div>
          ))}
        </div>
        <div className="summary">
          <h3>Lista Componentes</h3>
          {selectedProducts.map((product, index) => (
            <div key={index} className="selected-product">
              <p>{product.name} - {product.price}€</p>
              <button onClick={() => removeProduct(product)}>Remover</button>
            </div>
          ))}
          <p>IVA: {iva.toFixed(2)}€</p>
          <p>Total: {total.toFixed(2)}€</p>
        </div>
      </div>
    </div>
  );
};

export default Configurator;