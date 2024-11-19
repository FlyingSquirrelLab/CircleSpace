import "./bottom-nav.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";

const BottomNav = () => {
  const nav = useNavigate();
  const { role } = useAuth();

  return (
    <div className="bottom-nav-body">
      <div className="search-bn" onClick={() => nav("/search")}>
        <img src={searchIcon_bk} width="20px" onClick={() => nav("/search")} />
        <p>검색</p>
      </div>
      <div className="like-bn" onClick={() => nav("/likeList")}>
        <img src={blankLike} width="20px" />
        <p>관심동아리</p>
      </div>
      {role === "ROLE_ADMIN" ? (
        <div className="admin-bn" onClick={() => nav("/adminPage")}>
          <p>관리</p>
        </div>
      ) : (
        <div className="mp-bn" onClick={() => nav("/mypage")}>
          {/*<img src={myIcon} width='20px'/>*/}
          <p>마이페이지</p>
        </div>
      )}
    </div>
  );
};

export default BottomNav;
