import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../authContext.jsx";
import LogoutButton from "../../components/logoutButton.jsx";
import Login from "./login.jsx";
import './myPage.css';
import axiosInstance from "../../axiosInstance.jsx";

const MyPage = ({formatDate}) => {
  const nav = useNavigate();
  const {displayName, role} = useAuth();
  const [displayRole, setDisplayRole] = useState("");
  const [myClubs, setMyClubs] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);

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

  useEffect(() => {
    const fetchMyMemberships = async () => {
      try {
        const response = await axiosInstance.get('/membership/fetchMine');
        console.log(response.status);
        setMyMemberships(response.data);
      } catch (error) {
        console.error("Error fetching memberships", error);
      }
    }
    fetchMyMemberships();
  }, [displayName]);

  return(
    <div className='mypage-body'>
      <div className='mypage-user'>
        <div>
          <h3>{displayRole} {displayName} 님</h3>
          <div>
            <p>내가 매니저로 있는 동아리들</p>
            {Array.isArray(myClubs) && myClubs.length > 0 ? (
                myClubs.map((myClub) => (
                  <div key={myClub.id}>
                    <img src={myClub.imageUrl}
                         width='200px'
                         alt='이미지'
                         onClick={() => nav(`/detail/${myClub.id}`)}/>
                    <p onClick={() => nav(`/detail/${myClub.id}`)}>{myClub.title}</p>
                    <p onClick={() => nav(`/clubStatus/${myClub.id}`)}>회원 관리</p>
                    <p onClick={() => {nav(`/editClub/${myClub.id}`)}}>동아리 정보 수정</p>
                  </div>
                ))) :
              <p>나의 동아리가 없습니다.</p>
            }
          </div>
          <div>
            <p>내가 가입한 동아리들</p>
            {Array.isArray(myMemberships) && myMemberships.length > 0 ? (
              myMemberships.map((myMembershipDTO) => (
                <div key={myMembershipDTO.id}
                     onClick={() => nav(`/detail/${myMembershipDTO.clubId}`)}>
                  <img src={myMembershipDTO.imageUrl}
                       width='200px'
                       alt='이미지'/>
                  <p>{myMembershipDTO.title}</p>
                  <p>{formatDate(myMembershipDTO.approvalDate)}</p>
                </div>
              ))) : <p>내가 가입한 동아리가 없습니다.</p>
            }
          </div>
              <div className='mypage-list'>
              <br/>
              <div onClick={() => nav('/editUserInfo')}>회원정보수정
          </div>
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