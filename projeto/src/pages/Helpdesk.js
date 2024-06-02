import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Helpdesk.css';
import { Link } from 'react-router-dom'; 

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const Helpdesk = () => {
  const { user } = useAuth(); // Saber quemé o utilizador logado

  const [formData, setFormData] = useState({
    id: '', // ID único
    helpdeskType: '',
    equipment: '',
    invoiceNumber: '',
    description: '',
    email: user?.email || '', //Inserir e-mail
    status: 'Pendente' // Novo campo de estado
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setSuccessMessage('');
    setErrorMessage('');

    const newId = generateUniqueId();

  
    // Obtém a data atual
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-PT');
    console.log(formattedDate); // Exemplo de saída: 22/05/2024
  
    // Adiciona a data ao objeto formData
    const updatedFormData = {
      ...formData,
      id: newId,
      currentDate: formattedDate
    };
  
    // Verificação do campo descrição
    if (updatedFormData.description.trim() === '') {
      setErrorMessage('O campo descrição é obrigatório.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/helpdesk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
    
      if (!response.ok) {
        throw new Error('Erro ao enviar pedido');
      }

      console.log('Response:', response);
    
      const responseData = await response.json();
      const pedidoNumero = responseData.id;
    
      setSuccessMessage(`Pedido ${pedidoNumero} criado com sucesso!`);
      setFormData({
        helpdeskType: '',
        equipment: '',
        invoiceNumber: '',
        description: '',
        email: user?.email || '',
        status: 'Pendente',
      });
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      setErrorMessage('Erro ao enviar pedido.');
    }
  };
 

  return (
    <div className="helpdesk-container">
      <h2>Helpdesk</h2>
      <p>Bem-vindo ao centro de helpdesk, preencha os campos abaixo com informações sobre o seu pedido!</p>
      <div className="helpdesk-buttons">
        <Link to="/user-helpdesk" className="check-helpdesk-button">
          Consultar Pedido
        </Link>
      </div>
      <form className="helpdesk-form" onSubmit={handleSubmit}>
        <label>Tipo de pedido:</label>
        <select name="helpdeskType" value={formData.helpdeskType} onChange={handleChange} required>
          <option value="">Selecione</option>
          <option value="Suporte Técnico">Suporte Técnico</option>
          <option value="Informações">Informações</option>
          <option value="Reclamações">Reclamações</option>
        </select>
        <label>Equipamento:</label>
        <select name="equipment" value={formData.equipment} onChange={handleChange} required>
          <option value="">Selecione</option>
          <option value="Computador">Computador</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Tablet">Tablet</option>
        </select>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required readOnly />
        <label>Nº Fatura (se aplicável):</label>
        <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} />
        <label>*Descrição:</label>
        <textarea name="description" rows="5" value={formData.description} onChange={handleChange} required></textarea>
        <button type="submit">Enviar Pedido</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Helpdesk;