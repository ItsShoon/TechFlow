import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

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

const ProductList = ({ products, onDeleteProduct }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState('');

  useEffect(() => {
    let updatedProducts = products;

    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(product => product.category === selectedCategory);
    }

    if (filterManufacturer) {
      updatedProducts = updatedProducts.filter(product => product.manufacturer === filterManufacturer);
    }

    if (sortOrder === 'price-asc') {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'name-asc') {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'name-desc') {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === 'stock-asc') {
      updatedProducts.sort((a, b) => a.stock - b.stock);
    } else if (sortOrder === 'stock-desc') {
      updatedProducts.sort((a, b) => b.stock - a.stock);
    }

    setFilteredProducts(updatedProducts);
  }, [selectedCategory, sortOrder, filterManufacturer, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleManufacturerChange = (e) => {
    setFilterManufacturer(e.target.value);
  };

  return (
    <div className="product-list-container">
      <h2>Lista de Produtos</h2>
      <div className="product-list-controls">
        <Link to="/adicionar-produto" className="btn">Adicionar Produto</Link>
      </div>
      <div className="product-list-filters">
        <select onChange={handleSortChange}>
          <option value="">Ordenar</option>
          <option value="price-asc">Preço: Baixo para Alto</option>
          <option value="price-desc">Preço: Alto para Baixo</option>
          <option value="name-asc">Nome: A a Z</option>
          <option value="name-desc">Nome: Z a A</option>
          <option value="stock-asc">Stock: Baixo para Alto</option>
          <option value="stock-desc">Stock: Alto para Baixo</option>
        </select>
        <select onChange={handleManufacturerChange}>
          <option value="">Fabricante</option>
          {[...new Set(products.map(product => product.manufacturer))].map(manufacturer => (
            <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
          ))}
        </select>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={category === selectedCategory ? 'active' : ''}
          >
            {category}
          </button>
        ))}
        <button onClick={() => handleCategoryChange('')} className={!selectedCategory ? 'active' : ''}>
          Todos
        </button>
      </div>
      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th style={{ backgroundColor: '#333', color: '#f2f2f2' }}>Nome</th>
              <th style={{ backgroundColor: '#333', color: '#f2f2f2' }}>Categoria</th>
              <th style={{ backgroundColor: '#333', color: '#f2f2f2' }}>Fabricante</th>
              <th style={{ backgroundColor: '#333', color: '#f2f2f2' }}>Preço</th>
              <th style={{ backgroundColor: '#333', color: '#f2f2f2' }}>Stock</th>
              <th style={{ backgroundColor: '#333', color: '#f2f2f2' }}>Descrição</th>
              <th style={{ backgroundColor: '#333', color: '#f2f2f2' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.manufacturer}</td>
                <td>{product.price}€</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>
                  <Link to={`/editar-produto/${product.id}`} className="btn">Editar</Link>
                  <button onClick={() => onDeleteProduct(product.id)} className="btn delete-btn" style={{ marginLeft: '5px' }}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;