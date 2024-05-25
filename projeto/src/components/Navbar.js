import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CategoryMenu from './CategoryMenu';
import './Navbar.css';


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <CategoryMenu /> {/* Adiciona o componente CategoryMenu */}
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">TechFlow</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/configurator">Configurador</Link></li>
        <li><Link to="/">Campanhas e Ofertas</Link></li>
        {user && user.role === 'gestor' && (
          <>
            <li><Link to="/gerir-produtos">Gerir Produtos</Link></li>
            <li><Link to="/gerir-campanhas">Gerir Campanhas</Link></li>
            <li><Link to="/gerir-pedidos">Gerir Pedidos</Link></li>
          </>
        )}
      </ul>
      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="navbar-icons">
        {user ? (
          <>
          <Link to="/edit-profile" className="email-link">{user.email}</Link> {/* Adicione o Link aqui */}
          <button onClick={handleLogout}>Logout</button>
        </>
        ) : (
          <Link to="/login">👤</Link>
        )}
        <span className="cart-icon">🛒(0)</span>
      </div>
    </nav>
  );
};

export default Navbar;