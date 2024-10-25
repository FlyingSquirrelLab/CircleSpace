import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../authContext.jsx";
import './logoutButton.css';

const LogoutButton = () => {
  const { logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <button onClick={handleLogout} className='logoutButton'>
      로그아웃
    </button>
  );
};

export default LogoutButton;