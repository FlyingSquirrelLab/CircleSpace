import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../axiosInstance.jsx";

const EditPassword = () => {

  const nav = useNavigate();
  const [prevPassword, setPrevPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [error, setError] = useState('');

  const handlePrevPasswordChange = (e) => {
    setPrevPassword(e.target.value);
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
      const res1 = await axiosInstance.post('/member/checkPassword', {
        prevPassword
      })
      console.log(res1.status);

      const res2 = await axiosInstance.put('/member/editPassword', {
        password
      });
      console.log(res2.status);
      alert('비밀번호가 변경되었습니다.');
      nav('/myPage');

    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('기존 비밀번호가 일치하지 않습니다.');
      } else if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('비밀번호 수정 오류');
      }
    }
  };

  return (
    <div className='join-body'>
      <div className='join-container'>
        <h4 className='register-title'>비밀번호 변경</h4>
        <div className='register-infobox'>

          <div className='join-heading'>
            <p>기존 비밀번호</p>
            <input
              type="password"
              value={prevPassword}
              onChange={handlePrevPasswordChange}
              placeholder="Enter Previous Password"
            />
          </div>

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
        </div>
      </div>
    </div>
  );
}

export default EditPassword;