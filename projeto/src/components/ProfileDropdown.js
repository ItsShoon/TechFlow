import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfileDropdown.css';


const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="profile-dropdown">
      <button onClick={toggleDropdown} className="profile-button">
        {user.name.charAt(0).toUpperCase()}
      </button>
      {dropdownOpen && (
        <div className="dropdown-menu">
          <Link to="/edit-profile" className="dropdown-item">Editar Perfil</Link>
          <button onClick={handleLogout} className="dropdown-item">Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;