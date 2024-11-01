import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import LogoutButton from "../../components/logoutButton.jsx";
import {useAuth} from "../../authContext.jsx";
import './adminPage.css';

const AdminPage = () => {
  const nav = useNavigate();
  const {displayName, role} = useAuth();
  const [displayRole, setDisplayRole] = useState("");

  useEffect(() => {
    if (role === "ROLE_ADMIN") {
      setDisplayRole("관리자");
    } else if (role === "ROLE_USER") {
      setDisplayRole("일반 회원");
    }
  }, [role]);

  return (
    <div className='adminpage-body'>
      {displayName ? <h3>{displayRole} {displayName} 님</h3> : <p></p>}
      <div className='admin-list'>
        <div className='upload-bn' onClick={() => nav('/manageCategory')}
        >카테고리 관리</div>
        <br/>
        <div className='upload-bn' onClick={() => nav('/uploadClub')}
        >동아리 등록</div>
        <br/>
        <div
          className='mypage-admin'
          onClick={() => {
            nav('/mypage')
          }}
        >마이페이지</div>
        <br/>
        <div className='mypage-logout'>
          {displayName ? <LogoutButton/> : <p></p>}
        </div>
      </div>
    </div>
  )
}

export default AdminPage;