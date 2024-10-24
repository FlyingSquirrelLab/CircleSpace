import BannerMain from'../assets/Banner750x760.jpg'
import BannerMobile from '../assets/Banner750x760.jpg'
import {useEffect, useState} from "react";
import axios from "axios";
import List from "../components/list.jsx";

const Home =()=>{

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    axios.get('/api/club/getFeatured').then((data)=>{
      setClubs(data.data)
    }).catch(()=>{
        console.log('fail')
      })
  }, [clubs]);

  return(
    <div className="home">
      <div className='mainPoster'>
        <img
          className="deskTopSize"
          src={BannerMain} />
        <img
          className="mobileSize"
          src={BannerMobile} />
      </div>
      <div className='home-list'>
        <div className='home-featuredfont'>추천 동아리</div>
        <div className='clublist-row'>
          {Array.isArray(clubs) && clubs.length > 0 ? (
            clubs.map((club, index) => (
              <List key={index} club={club}/>
            ))
          ) : (
            <p>동아리 정보 준비중입니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;