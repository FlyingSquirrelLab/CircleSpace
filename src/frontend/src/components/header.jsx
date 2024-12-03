import { useNavigate } from 'react-router-dom';
import likeIcon from '../assets/blank_like.png'
import mainLogo from '../assets/teamelogo.png';
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
    <div className='club-header-body'>
      <div className='club-top-nav'>
        {displayName ? <p className='club-topnav-hello'>안녕하세요 {displayName} 님!</p> : <p></p>}
        {displayName ? <LogoutButton/> : <p></p>}
      </div>
      <div className='club-header'>
        <div className='club-category-icon'>
        </div>
        <div className='circlelogo'>
          <img src={mainLogo} width='250' onClick={() => {
            nav('/')
          }}/>
        </div>
        <div className='club-left-nav'>
          {displayName ?
            <div
              className='club-category'
              onClick={() => {
                if (username === '') {
                  nav('/login')
                } else {
                  nav('/myPage')
                }
              }}
            >MYPAGE
            </div>
            :
            <div className='club-category'>
              <span onClick={() => nav('/login')}>로그인</span>
              &nbsp;&nbsp;
              <span onClick={() => nav('/register')}>회원가입</span>
            </div>
          }
          {role === "ROLE_ADMIN" ?
            <div className='club-category' onClick={() => nav('/adminPage')}
            >ADMIN</div>
            : <p></p>}
          {role === "ROLE_USER" ?
            <div className='club-category' onClick={() => nav('/uploadClub')}
            >동아리 등록</div>
            : <p></p>}
        </div>
        <div className='club-right-nav'>
          {username ?
            <div className='club-header-icons'>
              <div
                className='club-wishlisticon'
                onClick={() => nav('/likeList')}>
                <img src={likeIcon} width='20px' height='19px' alt='관심동아리'/>
              </div>
            </div>
            : <p></p>}
        </div>
      </div>
      <div className='last-category-bar'>
        <div
          className='club-category'
          onClick={() => nav('/clubList/ALL')}
        >ALL
        </div>
        <div
          className='club-category'
          onClick={() => nav('/clubList/ACADEMIC')}
        >ACADEMIC
        </div>
        <div
          className='club-category'
          onClick={() => nav('/clubList/FOOD')}
        >FOOD
        </div>
        <div
          className='club-category'
          onClick={() => nav('/clubList/GAME')}
        >GAME
        </div>
        <div
          className='club-category'
          onClick={() => nav('/clubList/MUSIC')}
        >MUSIC
        </div>
        <div
          className='club-category'
          onClick={() => nav('/clubList/PERFORMANCE')}
        >PERFORMANCE
        </div>
        <div
          className='club-category'
          onClick={() => nav('/clubList/RELIGION')}
        >RELIGION
        </div>
        <div
          className='club-category'
          onClick={() => nav('/clubList/SCIENCE')}
        >SCIENCE
        </div>
        <div
          className='club-category'
          onClick={() => nav('/clubList/SPORTS')}
        >SPORTS
        </div>
        <div
          className='club-category'
          onClick={() => nav('/clubList/TRAVEL')}
        >TRAVEL
        </div>
        <div
          className='club-category'
          onClick={() => nav('/community/page')}
        >COMMUNITY
        </div>
        <div
          className='club-category'
          onClick={() => nav('/daily-up/page')}
        >Daily Updates
        </div>
      </div>
    </div>
  );
}

export default Header;
