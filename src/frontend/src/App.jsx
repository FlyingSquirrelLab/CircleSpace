import {Routes, Route, useLocation} from 'react-router-dom'
import Home from "./pages/home.jsx";
import Detail from "./pages/club/detail.jsx";
import {AuthProvider} from "./authContext.jsx";
import Header from "./components/header.jsx";
import ClubList from "./pages/club/clubList.jsx";
import Login from "./pages/member/login.jsx";
import EditClub from "./pages/club/editClub.jsx";
import MyPage from "./pages/member/myPage.jsx";
import Register from "./pages/member/register.jsx";
import AdminPage from "./pages/admin/adminPage.jsx";
import UploadClub from "./pages/club/uploadClub.jsx";
import LikeList from "./pages/member/likeList.jsx";
import QnADetail from "./pages/qna/qnaDetail.jsx";
import QnAPage from "./pages/qna/qnaPage.jsx";
import QnAUpload from "./pages/qna/qnaUpload.jsx";
import EditPassword from "./pages/member/editPassword.jsx";
import EditUserInfo from "./pages/member/editUserInfo.jsx";
import ManageCategory from "./pages/admin/manageCategory.jsx";
import ManageUniversity from "./pages/admin/manageUniversity.jsx";
import SeleniumTester from "./pages/admin/seleniumTester.jsx";
import Application from "./pages/member/application.jsx";
import ClubStatus from "./pages/club/clubStatus.jsx";

function App() {

  const location = useLocation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };


  return (
    <AuthProvider>
      <div className="App">
        {location.pathname !== '/login' && <Header/>}
        <Routes>
          <Route path='*' element={<div>존재하지 않는 페이지입니다.</div>} />
          <Route path='/adminPage' element={<AdminPage/>} />
          <Route path='/manageCategory' element={<ManageCategory/>} />
          <Route path='/manageUniversity' element={<ManageUniversity/>} />
          <Route path='/clubList/:category' element={<ClubList/>} />
          <Route path='/detail/:id' element={<Detail/>}/>
          <Route path='/editClub/:id' element={<EditClub/>} />
          <Route path='/editPassword' element={<EditPassword/>} />
          <Route path='/editUserInfo' element={<EditUserInfo/>} />
          <Route path='/' element={<Home/>}/>
          <Route path='/likeList' element={<LikeList/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/myPage' element={<MyPage/>} />
          <Route path='/qna/detail/:id' element={<QnADetail formatDate={formatDate}/>} />
          <Route path='/qna/page' element={<QnAPage formatDate={formatDate}/>} />
          <Route path='/qna/upload' element={<QnAUpload/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/uploadClub' element={<UploadClub/>} />
          <Route path='/test' element={<SeleniumTester/>}/>
          <Route path='/application/:id' element={<Application/>} />
          <Route path='/clubstatus' element={<ClubStatus/>} />

          <Route path='/ifRebase'/>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
