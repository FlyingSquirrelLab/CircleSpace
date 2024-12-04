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
          <h2>{displayRole} {displayName} 님</h2>
          <div>
            <p className='iminclub'>내가 매니저로 있는 동아리들</p>
            {Array.isArray(myClubs) && myClubs.length > 0 ? (
                myClubs.map((myClub) => (
                  <div className='myclub-list' key={myClub.id}>
                    <div className='myclub-menu'>
                      <img src={myClub.imageUrl}
                           width='100px'
                           alt='이미지'
                           onClick={() => nav(`/detail/${myClub.id}`)}/>

                      <div className='mc-control' onClick={() => nav(`/detail/${myClub.id}`)}>{myClub.title}</div>
                      <div className='mc-control' onClick={() => nav(`/clubStatus/${myClub.id}`)}>회원 관리</div>
                      <div className='mc-control' onClick={() => {
                        nav(`/editClub/${myClub.id}`)
                      }}>동아리 정보 수정</div>
                    </div>
                  </div>
                ))) :
              <p className='myclub-empty'>나의 동아리가 없습니다.</p>
            }
          </div>
          <div>
            <br/>
            <p>내가 가입한 동아리들</p>
            <div className='myclub'>
            {Array.isArray(myMemberships) && myMemberships.length > 0 ? (
              myMemberships.map((myMembershipDTO) => (
                <div className='myclub-container' key={myMembershipDTO.id}>
                  <img src={myMembershipDTO.imageUrl}
                       width='100px' height='100px'
                       alt='이미지'
                       onClick={() => nav(`/detail/${myMembershipDTO.clubId}`)}/>
                  <p>{myMembershipDTO.title}</p>
                  <p className='review-nav' onClick={() => {nav(`/review/upload/${myMembershipDTO.clubId}`)}}>리뷰 쓰러가기</p>
                  {/*<p>{formatDate(myMembershipDTO.approvalDate)}</p>*/}
                </div>
              ))) : <p className='myclub-empty'>내가 가입한 동아리가 없습니다.</p>
            }
            </div>
          </div>
          <div className='mypage-list-bts'>
            <button className='mypage-list-bt' onClick={() => nav('/editUserInfo')}>회원 정보 수정</button>
            <button className='mypage-list-bt' onClick={() => nav('/editPassword')}>비밀번호 변경</button>
            <button className='mypage-list-bt' onClick={() => nav('/uploadClub')}>동아리 등록하기</button>
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