import axios from "axios";
import {useState} from "react";
import axiosInstance from "../../axiosInstance.jsx";
import {useNavigate} from "react-router-dom";
import {setCookie} from "../../cookieUtil.jsx";
import {useAuth} from "../../authContext.jsx";

const FindUserInfo = () => {

  const {login} = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [error, setError] = useState('');

  const sendVerificationCode = async () => {
    try {
      const checkResponse = await axios.post('/api/member/findUserPhoneNumberCheck', { phoneNumber });

      if (checkResponse.status === 204) {
        setVerificationMessage('해당 전화번호의 회원정보가 존재하지 않습니다.');
      } else if (checkResponse.status === 200) {
        const response = await axios.post(`/api/register/sendMessage/${phoneNumber}`);
        setVerificationCode(response.data);
        setIsCodeSent(true);
        setVerificationMessage('인증번호가 발송되었습니다.');
      } else {
        setIsCodeSent(false);
        setVerificationMessage('전화번호 확인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setIsCodeSent(false);
      setVerificationMessage('전화번호 확인에 실패했습니다. 다시 시도해주세요.');
      console.error(error);
    }
  };

  const verifyCode = async () => {
    if (inputVerificationCode === String(verificationCode)) {
      try {
        const response = await axios.post('/api/member/getTokenByPhone', {
          phoneNumber: phoneNumber
        });

        const { accessToken, role, username, displayName, realName } = response.data;

        if (accessToken) {
          setCookie('token', accessToken, 1);
          login(accessToken, role, username, displayName, realName, phoneNumber);
          setIsPhoneNumberVerified(true);
          setVerificationMessage('인증이 완료되었습니다.');
        } else {
          setVerificationMessage('토큰 발급에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        setVerificationMessage('인증에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      setVerificationMessage('인증번호가 일치하지 않습니다.');
    }
  };

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);
    if (inputPassword.length < 8) {
      setPasswordError('비밀번호는 최소 8자리 이상이어야 합니다.');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const EditPasswordHandler = async () => {

    if (passwordError !== '') {
      alert('비밀번호는 최소 8자리 이상이어야 합니다.');
    }

    if (password !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axiosInstance.put('/member/editPassword', {
        password
      });
      console.log(response.status);
      alert('비밀번호가 변경되었습니다.');
      nav('/');
    } catch (error) {
      setError(error.response.data.message);
      console.error(error);
    }
  };

  return (
    <div className='join-body'>
      <div className='join-container' lang='ko'>
        <h4 className='register-title' >전화번호를 입력하세요.</h4>
        <div className='join-heading'>
          <input
            type='tel'
            className='displayName'
            placeholder='전화번호를 입력하세요 (숫자만)'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={sendVerificationCode}>회원 정보 찾기</button>
          {isCodeSent && !isPhoneNumberVerified && (
            <div>
              <br/>
              <input
                type="text"
                className='displayName'
                placeholder="인증번호 입력"
                value={inputVerificationCode}
                onChange={(e) => setInputVerificationCode(e.target.value)}
              />
              <button onClick={verifyCode}>인증하기</button>
            </div>
          )}
          {verificationMessage && <p className='verification-message'>{verificationMessage}</p>}
        </div>

        {isPhoneNumberVerified ?
          <div>
            <p>비밀번호 변경하기</p>
            <div className='join-heading'>
              <p>새 비밀번호</p>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter New Password"
              />
              {passwordError && <p className='error-message'>{passwordError}</p>}
            </div>

            <div className='join-heading'>
              <p>새 비밀번호 확인</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm New Password"
              />
              {confirmPasswordError && <p className='error-message'>{confirmPasswordError}</p>}
            </div>

            <div className='register-buttons'>
              <button className='join-button' onClick={EditPasswordHandler}>비밀번호 변경</button>
            </div>
            {error && <p className='error-message'>{error}</p>}
          </div> :
          <></>
        }
      </div>
    </div>
  );
}

export default FindUserInfo;