import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nif, setNif] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== retypePassword) {
      setError('As senhas não coincidem');
      return;
    }

    const newUser = {
      name,
      email,
      nif,
      address,
      postalCode,
      city,
      phone,
      password
    };

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log('Registro bem-sucedido:', data);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Registo</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>* Nome:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>* Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>* NIF:</label>
        <input type="text" value={nif} onChange={(e) => setNif(e.target.value)} required />
        <label>* Endereço:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <label>* Código Postal:</label>
        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        <label>* Cidade:</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        <label>* Telemóvel:</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <label>* Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>* Re-type password:</label>
        <input type="password" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} required />
        <label>
          <input type="checkbox" required /> Concordo com os <Link to="/terms">Termos de uso</Link> e <Link to="/privacy">Política de privacidade</Link>.
        </label>
        <button type="submit">Registar</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;