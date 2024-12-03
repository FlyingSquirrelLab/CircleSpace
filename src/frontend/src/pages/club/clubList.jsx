import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import List from "../../components/list.jsx";
import './clubList.css';
import PageController from "../../components/pageController.jsx";
import { useAuth } from "../../authContext.jsx";
import axiosInstance from "../../axiosInstance.jsx";

const ClubList = () => {
  const { username } = useAuth();
  const { category } = useParams();
  const size = 8;
  const [affiliation, setAffiliation] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryClubs, setCategoryClubs] = useState([]);
  const [order, setOrder] = useState('createdAt');

  useEffect(() => {
    const fetchCategoryClubs = async () => {
      try {
        if (username === '' || affiliation === false) {
          const response = await axios.get(`/api/club/getByCategory/${category}/${order}/${page}/${size}`);
          if (!response.data._embedded) {
            setCategoryClubs([]);
            setTotalPages(1);
          } else {
            setCategoryClubs(response.data._embedded.clubList);
            setTotalPages(response.data.page.totalPages);
          }
        } else {
          const response = await axiosInstance.get(`/club/getByCategoryAndUniversity/${category}/${order}/${page}/${size}`);
          if (!response.data._embedded) {
            setCategoryClubs([]);
            setTotalPages(1);
          } else {
            setCategoryClubs(response.data._embedded.clubList);
            setTotalPages(response.data.page.totalPages);
          }
        }
      } catch (error) {
        console.error("Error fetching clubs", error);
      }
    };
    fetchCategoryClubs();
    window.scrollTo(0, 0);
  }, [affiliation, username, category, order, page]);

  const handleOrder = (order) => {
    setOrder(order);
  };

  return (
    <div className="club-body">
      <div className='club-list-control'>
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
        <div className='club-list-control-bt'>
          <button onClick={() => handleOrder('createdAt')}>최신순</button>
          <button onClick={() => handleOrder('views')}>조회 많은 순</button>
        </div>
      </div>

      <div className="clublist-row">
        {Array.isArray(categoryClubs) && categoryClubs.length > 0 ? (
          categoryClubs.map((categoryClub) => (
            <List key={categoryClub.id} club={categoryClub} />
          ))
        ) : (
          <p>동아리 정보 준비중입니다.</p>
        )}
      </div>
      <PageController page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default ClubList;
