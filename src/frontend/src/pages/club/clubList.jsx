import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import List from "../../components/list.jsx";
import './clubList.css';
import PageController from "../../components/pageController.jsx";

const ClubList=()=>{

  const {category} = useParams();
  const size = 8;
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryClubs, setCategoryClubs] = useState([]);

  useEffect(() => {
    const fetchCategoryClubs = async () => {
      try {
        const response = await axios.get(`/api/club/getByCategory/${category}/${page}/${size}`);
        console.log(response.status);
        setCategoryClubs(response.data._embedded.clubList);
        setTotalPages(response.data.page.totalPages);
      } catch (error) {
        console.error("Error fetching clubs", error);
      }
    };
    fetchCategoryClubs();
    window.scrollTo(0, 0);
  }, [category, page]);

  return(
    <div className="club-body">
      <div className='clublist-row'>
        {Array.isArray(categoryClubs) && categoryClubs.length > 0 ? (
          categoryClubs.map((categoryClub) => (
            <List key={categoryClub.id} club={categoryClub}/>
          ))
        ) : (
          <p>동아리 정보 준비중입니다.</p>
        )}
      </div>

    <PageController page={page} setPage={setPage} totalPages={totalPages}/>
    </div>
  )
}

export default ClubList;