import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../authContext.jsx";
import LogoutButton from "../components/logoutButton.jsx";
import Login from "./login.jsx";
import './myPage.css';

const MyPage = ()=>{
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

  return(
    <div className='mypage-body'>
      <div className='mypage-user'>
        <div>
          {displayName ? <h3>{displayRole} {displayName} 님</h3> : <p></p>}
          {displayName ?
            <div className='mypage-list'>
              <br/>
              <div onClick={() => nav('/editUserInfo')}>회원정보수정</div>
              <br/>
              <div onClick={() => nav('/editPassword')}>비밀번호수정</div>
              <br/>
            </div>
            : <p></p>}
          <div className='mypage-logout'>
            {displayName ? <LogoutButton/> : <p></p>}
          </div>
          {displayName ? <p></p> :
            <div>
              <Login/>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
export default MyPage;