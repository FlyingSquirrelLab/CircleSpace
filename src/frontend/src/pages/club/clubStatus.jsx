import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInstance.jsx";
import app from "../../App.jsx";

const ClubStatus = () =>{

  const {id} = useParams();
  const nav = useNavigate();
  const [pending,setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    try {
      axios.get(`/api/club/getApplications/${id}`).then((response) => {
        setPending(response.data);
        console.log(response.data);
        console.log(response.status);
      })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [id]);

  useEffect(() => {
    try {
      axios.get(`/api/club/getClubMembers/${id}`).then((response) => {
        setApproved(response.data);
        console.log(response.data);
        console.log(response.status);
      })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [id]);

  const ApproveHandler = async(member) => {
    const response = await axios.put('/api/club/approve', {member});
    console.log(response.data);
    console.log(response.status);
    if (response.status === 200) {
      //pending에서 지우고 approved에 넣기

      let pendingCopy = [...pending];
      pendingCopy = pendingCopy.filter((item) => item.member.id !== member.id);
      setPending(pendingCopy);

      let approvedCopy = [...approved];
      approvedCopy.push(member);
      setApproved(approvedCopy);
    }
  }

  const DenyHandler = async(member) => {
    const response = await axios.put('/api/club/deny', {member});
    console.log(response.data);
    console.log(response.status);
    if (response.status === 200) {
      //pending에서 그냥 지우기
      let pendingCopy = [...pending];
      pendingCopy = pendingCopy.filter((item) => item.member.id !== member.id);
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
                    <div>
                      <div>{pendingMembership.member.realName}</div>
                      <div>{pendingMembership.intro}</div>
                      <button onClick={()=> ApproveHandler(pendingMembership.member)}>수락</button>
                      <br/>
                      <button onClick={()=> DenyHandler(pendingMembership.member)}>거절</button>
                    </div>
              ))
              ) : (<p>가입 희망 부원이 없습니다</p>)}
          </div>
        </div>
        <div>
          <h4>부원 목록</h4>
          <div>
            {Array.isArray(approved) && approved.length > 0 ? (
                approved.map((approvedMembers) => (
                    <div>
                      <div>{approvedMembers.member.realName}</div>
                      <div>{approvedMembers.intro}</div>
                    </div>
                ))
            ) : (<p>가입 희망 부원이 없습니다</p>)}
          </div>
        </div>
      </>
  );

}

export default ClubStatus;