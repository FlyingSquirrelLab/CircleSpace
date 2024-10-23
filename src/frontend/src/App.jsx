import './App.css';
import {Routes, Route, useLocation} from 'react-router-dom'
import List from "./pages/list.jsx";
import Home from "./pages/home.jsx";
import Detail from "./pages/detail.jsx";

function App() {

  return (
      <div className="App">
        <Routes>
          <Route path='*' element={<div>존재하지 않는 페이지입니다.</div>} />
          <Route path='/' element={<Home/>}/>
          <Route path='/list' element={<List/>} />
          <Route path='/detail/:id' element={<Detail/>}/>
        </Routes>
      </div>
  );
}

export default App;
