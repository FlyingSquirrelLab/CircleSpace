import { useNavigate } from 'react-router-dom';
import likeIcon from '../assets/blank_like.png'
import mainLogo from '../assets/logo80x30.png';
import LogoutButton from "./logoutButton.jsx";
import { useAuth } from "../authContext.jsx";
import { useEffect, useState } from "react";
import './header.css';

const Header = () => {
  const nav = useNavigate();
  const {username, displayName, role} = useAuth();
  const [displayRole, setDisplayRole] = useState("");

  useEffect(() => {
    if (role === "ROLE_ADMIN") {
      setDisplayRole("관리자");
    } else if (role === "ROLE_USER") {
      setDisplayRole("일반 회원");
    }
  }, [role]);

  return (
    <div className='header-body'>
      <div className='top-nav'>
        {displayName ? <p className='topnav-hello'>안녕하세요, {displayRole} {displayName} 님!</p> : <p></p>}
        {displayName ? <LogoutButton/> : <p></p>}
        {displayName ? <p></p> :
          <div>
            <span onClick={() => nav('/login')}>로그인</span>
            &nbsp;&nbsp;
            <span onClick={() => nav('/register')}>회원가입</span>
          </div>
        }
      </div>
      <div className='header'>
        <div>
          <img src={mainLogo} width='100px' onClick={() => {nav('/')}}/>
        </div>
        <div className='left-nav'>
            <div
              className='club-category'
              onClick={() => nav('/clubList/sports')}
            >스포츠
            </div>
            <div
              className='club-category'
              onClick={() => nav('/clubList/academic')}
            >학술
            </div>
            <div
              className='club-category'
              onClick={() => nav('/clubList/cultural')}
            >문화예술
            </div>
            <div
              className='club-category'
              onClick={() => nav('/clubList/science')}
            >과학기술
            </div>
          </div>
          <div
            className='club-category'
            onClick={() => nav('/qna/page')}
          >Q&A
          </div>
          <div
            className='mypage'
            onClick={() => {
              if (username === '') {
                nav('/login')
              } else {
                nav('/myPage')
              }
            }}
          > 마이페이지
          </div>
          <div className='admin-nav'>
            {role === "ROLE_ADMIN" ?
              <div className='adminpage' onClick={() => nav('/adminPage')}>관리</div>
              : <p></p>}
          </div>
        </div>
        <div className='right-nav'>
          {/*{location.pathname !== '/search' && (*/}
          {/*  <img className='search-icon' src={searchIcon_bk} width='21px' onClick={() => nav('/search')} />*/}
          {/*)}*/}
          {username ?
            <div className='header-icons'>
              <div
                className='wishlisticon'
                onClick={() => nav('/like')}>
                <img src={likeIcon} width='20px' height='19px' alt='관심동아리'/>
              </div>
            </div>
            : <p></p>}
      </div>
    </div>
  );
}

export default Header;
