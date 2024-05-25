import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="profile-button">
        👤
      </button>
      {dropdownOpen && (
        <div className="dropdown-menu">
          <Link to="/edit-profile" className="dropdown-item">Editar Perfil</Link>
          <div className="separator"></div> {/* Linha de separação */}
          <button onClick={handleLogout} className="dropdown-item">Terminar Sessão</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;