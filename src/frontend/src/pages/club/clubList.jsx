import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import List from "../../components/list.jsx";
import './clubList.css';

const ClubList=()=>{

  const {category, pageParam} = useParams();
  const size = 8;
  const [totalPages, setTotalPages] = useState(0);
  const page = parseInt(pageParam) - 1 || 0;
  const [categoryClubs, setCategoryClubs] = useState([]);
  const nav = useNavigate()

  useEffect(() => {
    const fetchCategoryClubs = async () => {
      try {
        const response = await axios.get(`/api/club/getByCategory/${category}/${page}/${size}`);
        console.log(response.data);
        setCategoryClubs(response.data._embedded.clubList);
        setTotalPages(response.data.page.totalPages);
      } catch (error) {
        console.error("Error fetching clubs", error);
      }
    };
    fetchCategoryClubs();
    window.scrollTo(0, 0);
  }, [category, page]);

  const handlePreviousPage = () => {
    const newPage = Math.max(page, 1);
    nav(`/item/${category}/${newPage}`);
  };

  const handleNextPage = () => {
    const newPage = Math.min(page + 2, totalPages);
    nav(`/item/${category}/${newPage}`);
  };


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

      <div className='pagecontroller' style={{marginTop: "100px"}}>
        <button className='page-bt' onClick={handlePreviousPage} disabled={page === 0}>
          Previous
        </button>
        <span className='page-span' style={{margin: "0 10px"}}>
          Page {page + 1} of {totalPages} Pages
        </span>
        <button className='page-bt' onClick={handleNextPage} disabled={page === totalPages - 1}>
          Next
        </button>
      </div>

    </div>
  )
}

export default ClubList;