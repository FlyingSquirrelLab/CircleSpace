import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [displayName, setDisplayName] = useState(localStorage.getItem('displayName') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  const login = (newToken, username, displayName, role) => {
    setToken(newToken);
    setUsername(username);
    setDisplayName(displayName);
    setRole(role);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', username);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setToken('');
    setUsername('');
    setDisplayName('');
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('displayName');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ token, username, displayName, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
