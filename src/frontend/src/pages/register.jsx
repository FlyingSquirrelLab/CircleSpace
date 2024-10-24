import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {

  const nav = useNavigate();

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [realName, setRealName] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false); // 인증 여부
  const [verificationMessage, setVerificationMessage] = useState('');

  const [error, setError] = useState('');

  const onChangeUsernameHandler = async () => {
    try {
      const res = await axios.post('/api/register/usernameCheck', {
        username
      });
      console.log(res.status);
      setUsernameError('사용 가능한 이메일입니다.');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setUsernameError('이미 사용중인 이메일입니다.');
      } else {
        setUsernameError('올바르지 않은 이메일 형식입니다.');
      }
    }
  };

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

  const sendVerificationCode = async () => {
    try {
      const checkResponse = await axios.post('/api/register/phoneNumberCheck', { phoneNumber });

      if (checkResponse.status === 200 && checkResponse.data === "사용가능한 전화번호입니다.") {
        const response = await axios.post(`/api/register/sendMessage/${phoneNumber}`);
        setVerificationCode(response.data);
        setIsCodeSent(true);
        setVerificationMessage('인증번호가 발송되었습니다.');
      } else {
        setVerificationMessage('이미 존재하는 전화번호입니다. 다른 전화번호를 입력하세요.');
        setIsCodeSent(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setVerificationMessage('이미 존재하는 전화번호입니다. 다른 전화번호를 입력하세요.');
      } else {
        setVerificationMessage('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
      setIsCodeSent(false);
    }
  };

  const verifyCode = () => {
    if (inputVerificationCode === String(verificationCode)) {
      setIsPhoneNumberVerified(true);
      setVerificationMessage('인증이 완료되었습니다.');
    } else {
      setVerificationMessage('인증번호가 일치하지 않습니다. 다시 시도해주세요.');
    }
  };

  const signupHandler = async () => {

    if (passwordError !== '') {
      alert('비밀번호는 최소 8자리 이상이어야 합니다.');
    }

    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (usernameError !== '사용 가능한 이메일입니다.') {
      alert("이메일이 중복됩니다.");
      return;
    }

    if (displayNameError !== '사용 가능한 닉네임입니다.') {
      alert("닉네임이 중복됩니다.");
      return;
    }

    if (!isPhoneNumberVerified) {
      alert("전화번호 인증이 완료되지 않았습니다.");
      return;
    }

    try {
      const response = await axios.post('/api/register/registerProc', {
        username,
        password,
        displayName,
        realName,
        phoneNumber
      });
      console.log(response.status);
      nav('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('회원가입 오류');
      }
    }
  };

  return (
    <div className='join-body'>
      <div className='join-container'>
        <h4 className='register-title'>기본정보</h4>
        <div className='register-infobox'>
          <p className='rq-input'>*필수입력사항</p>

          <div className='join-heading'>
            <p>* 전화번호</p>
            <input
              type='tel'
              className='displayName'
              placeholder='전화번호를 입력하세요 (숫자만)'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button onClick={sendVerificationCode}>전화번호 인증</button>
            {isCodeSent && !isPhoneNumberVerified && (
              <>
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={inputVerificationCode}
                  onChange={(e) => setInputVerificationCode(e.target.value)}
                />
                <button onClick={verifyCode}>인증하기</button>
              </>
            )}
            {verificationMessage && <p className='verification-message'>{verificationMessage}</p>}
          </div>

          <div className='join-heading'>
            <p>* 이메일</p>
            <input
              type='email'
              className='username'
              placeholder='이메일을 입력하세요'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={onChangeUsernameHandler}>이메일 중복 확인</button>
            {usernameError && <p className='error-message'>{usernameError}</p>}
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

          <div>
            <p>* 비밀번호</p>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
            />
            {passwordError && <p className='error-message'>{passwordError}</p>}
          </div>

          <div>
            <p>* 비밀번호 확인</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm password"
            />
            {confirmPasswordError && <p className='error-message'>{confirmPasswordError}</p>}
          </div>

          <div className='join-heading'>
            <p>* 성함</p>
            <input
              type='text'
              className='displayName'
              placeholder='성함을 입력하세요'
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
            />
          </div>
        </div>
        <div className='register-buttons'>
          <button className='join-button' onClick={signupHandler}>회원가입</button>
        </div>
        {error && <p className='error-message'>{error}</p>}
      </div>
    </div>
  );
};

export default Register;