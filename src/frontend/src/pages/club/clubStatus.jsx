import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import './clubStatus.css'

const ClubStatus = ({formatDate}) =>{

  const {id} = useParams();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    const getPending = async () => {
      try {
        const response = await axios.get(`/api/membership/fetchPending/${id}`);
        setPending(response.data);
        console.log(response.status);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getPending();
  }, [id]);

  useEffect(() => {
    const getApproved = async () => {
      try {
        const response = await axios.get(`/api/membership/fetchApproved/${id}`);
        setApproved(response.data);
        console.log(response.status);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getApproved();
  }, [id]);

  const ApproveHandler = async(id) => {
    try {
      const response = await axios.put(`/api/membership/approve/${id}`);
      console.log(response.status);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const DenyHandler = async(id) => {
    try {
      const response = await axios.delete(`/api/membership/delete/${id}`);
      console.log(response.status);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='clubstatus-body'>
      <div>
        <h4>가입 대기 명단</h4>
        <div>
          {Array.isArray(pending) && pending.length > 0 ? (
            pending.map((pendingDTO) => (
              <div key={pendingDTO.membershipId}>
                <div>{pendingDTO.username}</div>
                <div>{pendingDTO.realName}</div>
                <div>{pendingDTO.intro}</div>
                <div>{formatDate(pendingDTO.requestDate)}</div>
                <button onClick={() => ApproveHandler(pendingDTO.membershipId)}>수락</button>
                <br/>
                <button onClick={() => DenyHandler(pendingDTO.membershipId)}>거절</button>
              </div>
            ))
          ) : (<p className='myclub-empty'>가입 희망 부원이 없습니다</p>)}
        </div>
      </div>
      <div>
        <h4>부원 목록</h4>
        <div>
          {Array.isArray(approved) && approved.length > 0 ? (
            approved.map((approvedDTO) => (
              <div key={approvedDTO.membershipId}>
                <p>{approvedDTO.realName}</p>
                <p>{approvedDTO.username}</p>
                <p>{approvedDTO.intro}</p>
                <p>{approvedDTO.phoneNumber}</p>
                <p>{formatDate(approvedDTO.requestDate)}</p>
                <p>{formatDate(approvedDTO.approvalDate)}</p>
              </div>
            ))
          ) : (<p className='myclub-empty'>부원이 없습니다</p>)}
        </div>
      </div>
    </div>
  );

}

export default ClubStatus;