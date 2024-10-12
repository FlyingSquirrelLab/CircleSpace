import {useState} from "react";
import {useNavigate} from "react-router-dom";
import LogoutButton from "./logoutButton.jsx";

const Header = () => {

    const nav = useNavigate();
    const [displayRole, setDisplayRole] = useState("");
    const [cartStatus, setCartStatus] = useState();

    return (
      <div className='header-body'>
        <div className='top-nav'>
          <p className='topnav-hello'>안녕하세요, 사용자님!</p>
          <LogoutButton/>
          <div>
              <span onClick={() => nav('/login')}>로그인</span>
              &nbsp;&nbsp;
              <span onClick={() => nav('/register')}>회원가입</span>
          </div>
        </div>
      </div>
    );

}

export default Header;