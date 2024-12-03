import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import './qnaPage.css';
import PageController from "../../components/pageController.jsx";
import {useAuth} from "../../authContext.jsx";

const QnAPage = ({formatDate}) => {

  const {username} = useAuth();
  const nav = useNavigate();
  const size = 5;
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [qnaList, setQnAList] = useState([]);

  useEffect(() => {
    const fetchQnAs = async () => {
      try {
        const response = await axios.get(`/api/qna/fetchAll/${page}/${size}`);
        console.log(response.status);
        setQnAList(response.data._embedded.qnAList);
        setTotalPages(response.data.page.totalPages);
      } catch (error) {
        console.error("Error fetching QnAs", error);
      }
    };
    fetchQnAs();
    window.scrollTo(0, 0);
  }, [page]);

  const handleUploadButton = () => {
    if (username === '') {
      nav('/login');
    } else {
      nav('/community/upload');
    }
  }

  return (
    <div className='qnapage-body'>
      <div className='qnapage-container'>
        <h3 className='qnapage-title'>커뮤니티</h3>
        {Array.isArray(qnaList) && qnaList.length > 0 ? (
          qnaList.map((qna) => (
            <div key={qna.id} className='qnapage-contents'>
              <div className='qna-list' onClick={() => nav(`/community/detail/${qna.id}`)}>
                <h4 >{qna.qnaTitle}</h4 >
                <div className='qna-info'>
                  <p className='reply-displayname'>{qna.displayName}</p>
                  <p className='createdate'>{formatDate(qna.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </div>
      <PageController page={page} setPage={setPage} totalPages={totalPages}/>
      <button className='upload-qna' onClick={handleUploadButton}>게시글 작성하기</button>
    </div>
  );

}

export default QnAPage;