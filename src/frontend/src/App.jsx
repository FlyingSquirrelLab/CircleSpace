import './App.css';
import {Routes, Route, useLocation} from 'react-router-dom'

function App() {

  return (
      <div className="App">
        <Routes>
          <Route path='*' element={<div>존재하지 않는 페이지입니다.</div>} />
        </Routes>
      </div>
  );
}

export default App;
