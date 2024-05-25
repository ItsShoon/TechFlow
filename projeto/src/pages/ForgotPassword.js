import React from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <h2>Esqueceu a Password</h2>
      <form className="forgot-password-form">
        <label>Email:</label>
        <input type="email" required />
        <button type="submit">Recuperar Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;