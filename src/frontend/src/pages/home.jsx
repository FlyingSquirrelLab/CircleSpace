import BannerMain from'../assets/banner.png'
import BannerMobile from '../assets/Banner750x760.jpg'
import {useEffect, useState} from "react";
import axios from "axios";
import List from "../components/list.jsx";
import './home.css';

const Home =()=>{

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchHomeClubs = async () => {
      try {
        const response = await axios.get('/api/club/getByCategory/ALL/views/0/16');
        console.log(response.status);
        setClubs(response.data._embedded.clubList);
      } catch (error) {
        console.log(error);
      }
    }
    fetchHomeClubs();
  }, []);

  return(
    <div className="home">
      <div className='mainPoster'>
        <img
          className="deskTopSize"
          src={BannerMain} />
        {/*<img*/}
        {/*  className="mobileSize"*/}
        {/*  src={BannerMobile} />*/}
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