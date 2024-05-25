import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    if (email === 'gestor@techflow.pt' && password === 'gestor123') {
      const userInfo = { email, role: 'gestor' };
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return userInfo;
    } else {
      // Adicione uma verificação para outros usuários normais
      const userInfo = { email, role: 'user' };
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return userInfo;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};