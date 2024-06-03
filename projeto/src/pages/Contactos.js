import React, { useState } from 'react';
import './Contactos.css';

const Contactos = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendFormDataToServer = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatusMessage('Contato salvo com sucesso!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatusMessage('Erro ao salvar contato.');
      }
    } catch (error) {
      setStatusMessage('Erro ao enviar o contato.');
      console.error('Erro:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendFormDataToServer();
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Entre em Contato Connosco</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="message">Escreva aqui a sua mensagem:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="submit-button">Enviar</button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default Contactos;
