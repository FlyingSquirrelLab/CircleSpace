import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {setCookie} from "../../cookieUtil.jsx";
import {useAuth} from "../../authContext.jsx";
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const { login } = useAuth();

  const loginPost = async (loginParam) => {
    try {
      const header = {headers: {"Content-Type": "application/x-www-form-urlencoded"}};
      const form = new URLSearchParams();
      form.append('username', loginParam.username);
      form.append('password', loginParam.password);

      const res = await axios.post('/api/loginProc', form, header);

      if (res.status === 200) {
        console.log("login complete")
      }

      if (res.status === 200) {
        const { accessToken, username, displayName, role } = res.data;
        if (accessToken) {
          login(accessToken, username, displayName, role);
          setCookie('token', accessToken, 1);
          return { accessToken, username, displayName, role };
        } else {
          console.error('Token not found or invalid format');
          throw new Error('Token not found');
        }
      } else {
        console.error('Login failed with status: ', res.status);
        throw new Error('Login Failed');
      }
    } catch (error) {
      console.error('Login error: ', error);
      throw error;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const loginParam = {username, password}
    try {
      const { accessToken} = await loginPost(loginParam)
      if (accessToken) {
        nav('/');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <>
      <div className='login'>
        <h2>로그인</h2>
        <form className='loginform' onSubmit={handleLogin}>
          <input
            type="text"
            placeholder='이메일'
            className='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required/>

          <input
            type="password"
            placeholder='비밀번호'
            value={password}
            className='password'
            onChange={(e) => setPassword(e.target.value)}
            required/>

          <button type="submit" className='loginButton'>Login</button>
        </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <div>
          <button className='findButton'>아이디/비밀번호 찾기</button>
          <h4>아직 회원이 아니신가요?</h4>
          <button className='joinButton' onClick={()=>nav('/register')}>회원가입</button>
        </div>
        <div>
          <p onClick={() => {
            nav('/');
          }}>홈으로</p>
        </div>
      </div>
    </>
  );
}

export default Login;