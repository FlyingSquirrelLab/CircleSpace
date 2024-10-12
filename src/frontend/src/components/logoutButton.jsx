import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const nav = useNavigate();

  const handleLogout = () => {
    nav('/login');
  };

  return (
    <button onClick={handleLogout} className='logoutButton'>
      로그아웃
    </button>
  );
};

export default LogoutButton;