import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';

const EditProduct = ({ products, onUpdateProduct }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const productToEdit = products.find(p => p.id === parseInt(id));
    if (productToEdit) {
      setProduct(productToEdit);
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setManufacturer(productToEdit.manufacturer);
      setPrice(productToEdit.price);
      setStock(productToEdit.stock);
      setDescription(productToEdit.description);
      setImage(productToEdit.image);
    }
  }, [id, products]);

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      name,
      category,
      manufacturer,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      image
    };
    onUpdateProduct(updatedProduct);
    navigate('/gerir-produtos');
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
    <div className="edit-product-container">
      <h2>Editar Produto</h2>
      <form className="edit-product-form" onSubmit={handleUpdateProduct}>
        <label>Nome:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        
        <label>Categoria:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        
        <label>Fabricante:</label>
        <input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} required />
        
        <label>Preço:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        
        <label>Stock:</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        
        <label>Descrição:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        
        <label>Imagem:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && <img src={image} alt="Product" className="preview-image" />}
        
        <button type="submit">Atualizar Produto</button>
      </form>
    </div>
  );
};

export default EditProduct;