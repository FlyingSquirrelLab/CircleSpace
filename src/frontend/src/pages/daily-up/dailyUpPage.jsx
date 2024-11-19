import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import './dailyUpPage.css';
import PageController from "../../components/pageController.jsx";

const DailyUpPage = ({formatDate}) => {

  const nav = useNavigate();
  const size = 10;
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dailyUpList, setDailyUpList] = useState([]);

  useEffect(() => {
    const fetchDailyUpdates = async () => {
      try {
        const response = await axios.get(`/api/daily-up/fetchAll/${page}/${size}`);
        console.log(response.status);
        setDailyUpList(response.data._embedded.promoList);
        console.log(response.data._embedded.promoList);
        setTotalPages(response.data.page.totalPages);
      } catch (error) {
        console.error("Error fetching Daily Updates", error);
      }
    };
    fetchDailyUpdates();
    console.log(dailyUpList);
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className='daily-up-page-body'>
      <div className='daily-up-page-container'>
        <h3 className='daily-up-page-title'>Daily Updates 게시판</h3>
        {Array.isArray(dailyUpList) && dailyUpList.length > 0 ? (
          dailyUpList.map((dailyUp) => (
            <div key={dailyUp.id} className='daily-up-page-contents'>
              <div className='daily-up-list' onClick={() => nav(`/daily-up/detail/${dailyUp.id}`)}>
                <h4 className='daily-up-title'>{dailyUp.title}</h4 >
                <div className='daily-up-info'>
                  <p className='createdate'>{formatDate(dailyUp.postedAt)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Daily Updates 가 없습니다.</p>
        )}
      </div>
      <PageController page={page} setPage={setPage} totalPages={totalPages}/>
    </div>
  );

}

export default DailyUpPage;