import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import List from "../components/list.jsx";
import './clubList.css';

const ClubList=()=>{

  const {category} = useParams();
  const [categoryClubs, setCategoryClubs] = useState([]);
  const nav = useNavigate()

  useEffect(() => {
    axios.get(`/api/club/getClubByCategory/${category}`).then((data)=>{
      setCategoryClubs(data.data);
    })
      .catch(()=>{
        console.log('fail')
      })
  }, [category]);

  return(
    <div className="club-body">
      <div className='mobile-club-category'>
        <div
          className='category-mobile'
          onClick={() => nav('/clubList/sports')}
        >체육동아리</div>
        <div
          className='category-mobile'
          onClick={() => nav('/clubList/academic')}
        >학술동아리</div>
        <div
          className='category-mobile'
          onClick={() => nav('/clubList/cultural')}
        >문화동아리</div>
        <div
          className='category-mobile'
          onClick={() => nav('/clubList/science')}
        >과학, 기술동아리</div>
      </div>
      <div className='clublist-row'>
        {Array.isArray(categoryClubs) && categoryClubs.length > 0 ? (
          categoryClubs.map((categoryClub) => (
            <List key={categoryClub.id} club={categoryClub}/>
          ))
        ) : (
          <p>동아리 정보 준비중입니다.</p>
        )}
      </div>
    </div>
  )
}

export default ClubList;