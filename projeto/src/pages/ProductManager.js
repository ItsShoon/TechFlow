import React, { useState } from 'react';
import './ProductManager.css';

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

const ProductManager = ({ products = [], onAddProduct }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: products.length + 1,
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      manufacturer,
      description,
      image
    };
    onAddProduct(newProduct);
    setName('');
    setCategory('');
    setPrice('');
    setStock('');
    setManufacturer('');
    setDescription('');
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="product-manage-container">
      <h2>Adicionar Produto</h2>
      <form className="product-manage-form" onSubmit={handleAddProduct}>
        <label>Nome:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        
        <label>Categoria:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Selecione uma categoria</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        
        <label>Preço:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        
        <label>Stock:</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        
        <label>Fabricante:</label>
        <input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} required />
        
        <label>Descrição:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        
        <label>Imagem:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && <img src={image} alt="Product" className="preview-image" />}
        
        <button type="submit">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default ProductManager;
