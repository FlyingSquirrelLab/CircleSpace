import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInstance.jsx";
import './register.css'

const EditUserInfo = () => {

  const nav = useNavigate();

  const [username, setUsername] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');

  const [realName, setRealName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/member/fetchUserInfo');
        const userInfo = response.data;

        setUsername(userInfo.username);
        setDisplayName(userInfo.displayName);
        setRealName(userInfo.realName);
        setPhoneNumber(userInfo.phoneNumber);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const onChangeDisplayNameHandler = async () => {
    try {
      const res = await axios.post('/api/register/displayNameCheck', {
        displayName
      });
      console.log(res.status)
      setDisplayNameError('사용 가능한 닉네임입니다.');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setDisplayNameError(
          '이미 사용중인 닉네임입니다.');
      } else {
        setDisplayNameError('An error occurred. Please try again.');
      }
    }
  };

  const editUserInfoHandler = async () => {

    if (displayNameError !== '사용 가능한 닉네임입니다.') {
      alert("닉네임이 중복됩니다.");
      return;
    }

    try {
      const response = await axiosInstance.put('/member/editUserInfo', {
        displayName,
        realName
      });
      console.log(response.status);
      nav('/myPage');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('회원 정보 수정 오류');
      }
    }
  };

  return (
    <div className='join-body'>
      <div className='join-container'>
        <h4 className='register-title'>회원 정보 수정</h4>
        <div className='register-infobox'>
          <div className='join-heading'>
            <p>전화번호</p>
            <input
              type='tel'
              className='displayName'
              value={phoneNumber}
              readOnly
            />
          </div>

          <div className='join-heading'>
            <p>이메일</p>
            <input
              type='email'
              className='username'
              value={username}
              readOnly
            />
          </div>

          <div className='join-heading'>
            <p>* 닉네임</p>
            <input
              type='text'
              className='displayName'
              placeholder='닉네임을 입력하세요'
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <button onClick={onChangeDisplayNameHandler}>닉네임 중복 확인</button>
            {displayNameError && <p className='error-message'>{displayNameError}</p>}
          </div>

          <div className='join-heading'>
            <p>성함</p>
            <input
              type='text'
              className='displayName'
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
            />
          </div>

        </div>
        <div className='register-buttons'>
          <button className='join-button' onClick={editUserInfoHandler}>제출</button>
        </div>
        {error && <p className='error-message'>{error}</p>}
      </div>
    </div>
  );
};

export default EditUserInfo;