import BannerMain from'../assets/banner.png'
import BannerMobile from '../assets/Banner750x760.jpg'
import React, {useEffect, useState} from "react";
import axios from "axios";
import List from "../components/list.jsx";
import './home.css';
import {useAuth} from "../authContext.jsx";

const Home =()=>{

  const [clubs, setClubs] = useState([]);
  const {username} = useAuth();
  const [affiliation, setAffiliation] = useState(false);

  useEffect(() => {
    const fetchHomeClubs = async () => {
      try {
        if (affiliation === false) {
          const response = await axios.get('/api/club/getByCategory/ALL/views/0/16');
          console.log(response.status);
          setClubs(response.data._embedded.clubList);
        } else {
          const response = await axios.get(`/api/club/getByCategoryAndUsername/ALL/${username}/views/0/16`);
          console.log(response.status);
          setClubs(response.data._embedded.clubList);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchHomeClubs();
  }, [affiliation, username]);

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
        {username === '' ? <></> :
          <div>
            <input type="checkbox"
                   checked={affiliation}
                   onChange={(e) => setAffiliation(e.target.checked)}/><label>소속 대학교만 보기</label>
          </div>
        }
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