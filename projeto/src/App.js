import React, { useState, useEffect } from 'react';
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
    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then(response => response.json())
      .then(savedProduct => setProducts([...products, savedProduct]))
      .catch(error => console.error('Error adding product:', error));
  };

  const handleUpdateProduct = (updatedProduct) => {
    fetch(`http://localhost:5000/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;