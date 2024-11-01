import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import './qnaPage.css';

const QnAPage = ({formatDate}) => {

  const nav = useNavigate();
  const [qnaList, setQnAList] = useState([]);

  useEffect(() => {
    const fetchQnA = async() => {
      try {
        const response = await axios.get('/api/qna/fetchAll');
        setQnAList(response.data);
      } catch (error) {
        console.error("Error Fetching QnA List");
      }
    };
    fetchQnA();
  }, []);

  return (
    <div className='qnapage-body'>
      <div className='qnapage-container'>
        <h3 className='qnapage-title'>QnA 게시판</h3>
        {Array.isArray(qnaList) && qnaList.length > 0 ? (
          qnaList.map((qna) => (
            <div key={qna.id} className='qnapage-contents'>
              <div className='qna-list' onClick={() => nav(`/qna/detail/${qna.id}`)}>
                <h4 >{qna.qnaTitle}</h4 >
                <div className='qna-info'>
                  <p className='reply-displayname'>{qna.displayName}</p>
                  <p className='createdate'>{formatDate(qna.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>QnA 가 없습니다.</p>
        )}
      </div>
      <button className='upload-qna' onClick={() => nav('/qna/upload')}>QnA 작성하기</button>
    </div>
  );

}

export default QnAPage;