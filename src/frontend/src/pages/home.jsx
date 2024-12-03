import BannerMain from '../assets/banner.png';
import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "../components/list.jsx";
import './home.css';
import { useAuth } from "../authContext.jsx";
import axiosInstance from "../axiosInstance.jsx";

const Home = () => {
  const [clubs, setClubs] = useState([]);
  const { username } = useAuth();
  const [affiliation, setAffiliation] = useState(false);

  useEffect(() => {
    const fetchHomeClubs = async () => {
      try {
        if (username === '') {
          const response = await axios.get('/api/club/getByCategory/ALL/views/0/16');
          if (!response.data._embedded) {
            console.log('데이터가 없습니다.');
            setClubs([]);
          } else {
            setClubs(response.data._embedded.clubList);
          }
        } else {
          if (affiliation === false) {
            const response = await axiosInstance.get('/club/getByCategories/views/0/16');
            if (!response.data._embedded) {
              console.log('데이터가 없습니다.');
              setClubs([]);
            } else {
              setClubs(response.data._embedded.clubList);
            }
          } else {
            const response = await axiosInstance.get(`/club/getByCategoriesAndUniversity/views/0/16`);
            if (!response.data._embedded) {
              console.log('데이터가 없습니다.');
              setClubs([]);
            } else {
              setClubs(response.data._embedded.clubList);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchHomeClubs();
  }, [affiliation, username]);

  return (
    <div className="club-home">
      <div className='club-mainPoster'>
        <img
          className="club-deskTopSize"
          src={BannerMain} />
      </div>
      <div className='club-home-list'>
        <div className='club-home-featuredfont'>추천 동아리</div>
        {username === '' ? <></> :
          <div className='club-list-control-bt'>
            {affiliation ?
              <button onClick={() => {
                setAffiliation(false);
              }}>전체 대학교 보기</button>
              :
              <button onClick={() => {
                setAffiliation(true);
              }}>소속 대학교만 보기</button>
            }
          </div>
        }
        <div className='club-clublist-row'>
          {Array.isArray(clubs) && clubs.length > 0 ? (
            clubs.map((club, index) => (
              <List key={index} club={club} />
            ))
          ) : (
            <p>동아리 정보 준비중입니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
