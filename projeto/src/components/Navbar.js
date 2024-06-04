import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CategoryMenu from './CategoryMenu';
import ProfileDropdown from './ProfileDropdown';
import useCart from '../hooks/useCart';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart, getTotalItems } = useCart();
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    console.log('Cart updated:', cart);
    setCartCount(getTotalItems());
  }, [cart, getTotalItems]);

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
            <span className="user-email">{user.email}</span>
            <ProfileDropdown />
          </>
        ) : (
          <Link to="/login">👤</Link>
        )}
        <Link to="/cart" className="cart-icon-link">
          <span className="cart-icon">🛒({cartCount})</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;