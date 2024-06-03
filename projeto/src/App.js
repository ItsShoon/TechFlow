import React  from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Configurator from './pages/Configurator'; 
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProductManager from './pages/ProductManager';
import CampaignManager from './pages/CampaignManager';
import EditProduct from './pages/EditProduct';
import EditCampaign from './pages/EditCampaign';
import ProtectedRoute from './components/ProtectedRoute';
import Helpdesk from './pages/Helpdesk';
import HelpdeskManager from './pages/HelpdeskManager';
import UserHelpdesk from './pages/UserHelpdesk';
import EditProfile from './pages/EditProfile';
import ProductList from './pages/ProductList';
import Faq from './pages/Faq';
import Contactos from './pages/Contactos';
import Termosecondicoes from './pages/Termosecondicoes';

const App = () => {
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleAddProduct = (newProduct) => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('category', newProduct.category);
    formData.append('manufacturer', newProduct.manufacturer);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('description', newProduct.description);
    formData.append('image', newProduct.image);

    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(savedProduct => setProducts([...products, savedProduct]))
      .catch(error => console.error('Error adding product:', error));
  };

  const handleUpdateProduct = (updatedProduct) => {
    const formData = new FormData();
    formData.append('name', updatedProduct.name);
    formData.append('category', updatedProduct.category);
    formData.append('manufacturer', updatedProduct.manufacturer);
    formData.append('price', updatedProduct.price);
    formData.append('stock', updatedProduct.stock);
    formData.append('description', updatedProduct.description);
    formData.append('image', updatedProduct.image);

    fetch(`http://localhost:5000/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      body: formData,
    })
      .then(() => {
        const updatedProducts = products.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
        setProducts(updatedProducts);
      })
      .catch(error => console.error('Error updating product:', error));
  };

  const handleDeleteProduct = (id) => {
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  const handleAddCampaign = (newCampaign) => {
    setCampaigns([...campaigns, newCampaign]);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/gerir-produtos" 
            element={
              <ProtectedRoute>
                <ProductList products={products} onDeleteProduct={handleDeleteProduct} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/gerir-campanhas" 
            element={
              <ProtectedRoute>
                <CampaignManager campaigns={campaigns} onAddCampaign={handleAddCampaign} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/adicionar-produto" 
            element={
              <ProtectedRoute>
                <ProductManager onAddProduct={handleAddProduct} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editar-produto/:id" 
            element={
              <ProtectedRoute>
                <EditProduct products={products} onUpdateProduct={handleUpdateProduct} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editar-campanha" 
            element={
              <ProtectedRoute>
                <EditCampaign campaigns={campaigns} />
              </ProtectedRoute>
            } 
          />
          <Route path="/support" element={<Helpdesk />} />
          <Route path="/gerir-pedidos" element={<HelpdeskManager />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/user-helpdesk" element={<UserHelpdesk />} /> 
          <Route path="/edit-profile" element={<EditProfile />} /> 
          <Route path="/faq" element={<Faq/>} /> 
          <Route path="/contactos" element={<Contactos/>} /> 
          <Route path="/termosecondicoes" element={<Termosecondicoes/>} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
