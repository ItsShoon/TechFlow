import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // Adicione outros campos conforme necessário
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        // Inicialize outros campos com os dados do usuário
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Adicione a lógica de envio para atualizar os dados do usuário
  };

  return (
    <div className="edit-profile-container">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required readOnly />
        {/* Adicione outros campos conforme necessário */}
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditProfile;