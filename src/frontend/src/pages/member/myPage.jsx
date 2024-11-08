import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../authContext.jsx";
import LogoutButton from "../../components/logoutButton.jsx";
import Login from "./login.jsx";
import './myPage.css';
import axiosInstance from "../../axiosInstance.jsx";

const MyPage = ()=>{
  const nav = useNavigate();
  const {displayName, role} = useAuth();
  const [displayRole, setDisplayRole] = useState("");
  const [myClubs, setMyClubs] = useState([]);

  useEffect(() => {
    if (role === "ROLE_ADMIN") {
      setDisplayRole("관리자");
    } else if (role === "ROLE_USER") {
      setDisplayRole("일반 회원");
    }
  }, [role]);

  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const response = await axiosInstance.get('/member/getMyClubs');
        console.log(response.status);
        setMyClubs(response.data);
      } catch (error) {
        console.error("Error fetching clubs", error);
      }
    }
    fetchMyClubs();
  }, [displayName]);

  return(
    <div className='mypage-body'>
      <div className='mypage-user'>
        <div>
          <h3>{displayRole} {displayName} 님</h3>
          <div>
            <p>나의 동아리 수정</p>
            {Array.isArray(myClubs) && myClubs.length > 0 ? (
              myClubs.map((myClub) => (
                <div key={myClub.id} onClick={() => {nav(`/editClub/${myClub.id}`)}}>
                  <img src={myClub.imageUrl} width='200px' alt='이미지'/>
                  <p>{myClub.title}</p>
                </div>
              ))) :
              <p>나의 동아리가 없습니다.</p>
            }
          </div>
          <div className='mypage-list'>
            <br/>
            <div onClick={() => nav('/editUserInfo')}>회원정보수정</div>
            <br/>
            <div onClick={() => nav('/editPassword')}>비밀번호수정</div>
            <br/>
            <div onClick={() => nav('/uploadClub')}>동아리등록하기</div>
          </div>
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