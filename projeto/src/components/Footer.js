// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="newsletter">
        <h3>Receba as melhores promoções!</h3>
        <input type="email" placeholder="Email" />
        <button>Subscrever</button>
      </div>
      <div>
        <Link to="/contactos">Contactos</Link> | <Link to="/faq">Perguntas frequentes</Link> | <Link to="/support">Suporte</Link> | <Link to="/termosecondicoes">Termos e Condições</Link>
      </div>
    </footer>
  );
};

export default Footer;
