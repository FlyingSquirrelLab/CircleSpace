import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const ClubStatus = () =>{

  const {clubId} = useParams();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    const getPending = async () => {
      try {
        // 아직 승인 안된 Membership 엔티티들을 가지고옴
        const response = await axios.get(`/api/club/getPending/${clubId}`);
        setPending(response.data);
        console.log(response.data);
        console.log(response.status);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getPending();
  }, [clubId]);

  useEffect(() => {
    const getMembers = async () => {
      try {
          // 승인 된 Membership 엔티티들을 가지고 옴
        const response = await axios.get(`/api/club/getClubMembers/${clubId}`);
        setApproved(response.data);
        console.log(response.data);
        console.log(response.status);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
      getMembers();
  }, [clubId]);

  const ApproveHandler = async (id) => {
    const response = await axios.put(`/api/club/approve/${id}`);
    console.log(response.data);
    console.log(response.status);
    if (response.status === 200) {
      // membership.approved = true;
      // pending에서 지우고 approved에 넣기

      window.location.reload();
    }
  }

  const DenyHandler = async() => {
    const response = await axios.delete('/api/club/deny', {member});
    console.log(response.data);
    console.log(response.status);
    if (response.status === 200) {
      //pending에서 그냥 지우기
      let pendingCopy = [...pending];
      pendingCopy = pendingCopy.filter((item) => item.member.clubId !== member.clubId);
      setPending(pendingCopy);
    }
  }

  return (
      <>
        <div>
          <h4>가입 대기 명단</h4>
          <div>
            {Array.isArray(pending) && pending.length > 0 ? (
                pending.map((pendingMembership) => (
                    <div key={pendingMembership.id}>
                      <div>{pendingMembership.member.realName}</div>
                      <div>{pendingMembership.intro}</div>
                      <button onClick={()=> ApproveHandler(pendingMembership.id)}>수락</button>
                      <br/>
                      <button onClick={()=> DenyHandler(pendingMembership.id)}>거절</button>
                    </div>
              ))
              ) : (<p>가입 희망 부원이 없습니다</p>)}
          </div>
        </div>
        <div>
          <h4>부원 목록</h4>
          <div>
            {Array.isArray(approved) && approved.length > 0 ? (
                approved.map((approvedMembership) => (
                    <div key={approvedMembership.id}>
                      <div>{approvedMembership.member.realName}</div>
                      <div>{approvedMembership.intro}</div>
                    </div>
                ))
            ) : (<p>부원이 없습니다</p>)}
          </div>
        </div>
      </>
  );

}

export default ClubStatus;