import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const nav = useNavigate();

  return (
    <div className="footer">
      <div className="footerNav" onClick={() => nav("/introduction")}>
        단체소개
      </div>
      <div className="notice" onClick={() => nav("/notice")}>
        공지사항
      </div>
    </div>
  );
};

export default Footer;
