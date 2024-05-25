import React, { useState, useEffect } from 'react';
import useFetchUser from '../hooks/useFetchUser';
import { useAuth } from '../context/AuthContext';
import './EditProfile.css';

const EditProfile = () => {
  const { user: authUser } = useAuth();
  const email = authUser?.email;

  console.log("Auth user:", authUser); // Log de depuração
  console.log("Email:", email); // Log de depuração

  const { user, loading, error } = useFetchUser(email);

  console.log("Fetched user:", user); // Log de depuração
  console.log("Loading:", loading); // Log de depuração
  console.log("Error:", error); // Log de depuração

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nif: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        nif: user.nif || '',
        address: user.address || '',
        postalCode: user.postalCode || '',
        city: user.city || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/users?email=${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erro ao atualizar perfil: ${errorMessage}`);
      }

      console.log('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar perfil: {error}</p>;
  }

  return (
    <div className="edit-profile-container">
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>Nome:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required readOnly />
        </label>
        <label>NIF:
          <input type="text" name="nif" value={formData.nif} onChange={handleChange} required />
        </label>
        <label>Endereço:
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <label>Código Postal:
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
        </label>
        <label>Cidade:
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </label>
        <label>Telemóvel:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>
        <label>Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <label>Re-type Password:
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </label>
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditProfile;