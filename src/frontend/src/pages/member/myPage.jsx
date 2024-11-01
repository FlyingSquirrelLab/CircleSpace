import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../authContext.jsx";
import LogoutButton from "../../components/logoutButton.jsx";
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

  // 특정 회원이 관리자로 있는 동아리를 보여줌
  // 그 동아리들에 대해서 수정, 삭제 할 수 있음

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
              <div onClick={() => nav('/uploadClub')}>동아리등록하기</div>
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