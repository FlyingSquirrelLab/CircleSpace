import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance.jsx";
import {useAuth} from "../authContext.jsx";
import './qnaDetail.css';

const QnADetail = ({formatDate}) => {

  const {id} = useParams();
  const [qna, setQnA] = useState({});
  const nav = useNavigate();
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState([]);
  const {username, role} = useAuth();

  useEffect(() => {
    const fetchQnAById = async() => {
      try {
        const response = await axios.get(`/api/qna/fetchById/${id}`);
        setQnA(response.data);
      } catch (error) {
        console.error("Error Fetching QnA");
      }
    };
    fetchQnAById();
  }, [id]);

  useEffect(() => {
    const fetchReplyByQnA = async() => {
      try {
        const response = await axios.get(`/api/reply/fetchByQnAId/${id}`);
        setReplies(response.data);
      } catch (error) {
        console.error("Error Fetching Reply");
      }
    }
    fetchReplyByQnA();
  }, [id]);

  const replyUploadHandler = async (e) => {
    e.preventDefault();

    try {
      const replyData = {
        parentId: id,
        replyContent
      };

      const response = await axiosInstance.post('/reply/add', replyData);
      console.log(response.data);
      setReplies([...replies, response.data]);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading Reply', error);
    }
  };

  const deleteReplyHandler = async (replyId) => {
    try {
      await axiosInstance.delete(`/reply/deleteById/${replyId}`);
      setReplies(replies.filter(reply => reply.id !== replyId));
    } catch (error) {
      console.error('Error deleting reply', error);
    }
  };

  return (
    <div className='qnadetail-body'>
      <div key={qna.id} className='qnadetail-list'>
        <h3 className='qnalist-title'>문의 내용</h3>
        <div className='qnadetail-container'>
          <h4>{qna.title}</h4>
          <div className='qnadetail-info'>
            <p className='reply-displayname'>{qna.displayName}</p>
            <p className='createdate'>{formatDate(qna.createdAt)}</p>
          </div>
          <p>{qna.content}</p>
          <img src={qna.imageUrl} width='200px'/>
        </div>

        <div className='qnareply-body'>
          {Array.isArray(replies) && replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply.id} className='qnareply-list'>
                <div className='qnareply-container'>
                  <div className='qnareply-contents'>
                    <p className='reply-displayname'>{reply.displayName}</p>
                    <p>{reply.content}</p>
                  </div>
                  <p className='createdate'>{formatDate(reply.createdAt)}</p>
                </div>
                {username === reply.username || role === 'ROLE_ADMIN' ? (
                  <div className='reply-delete' onClick={() => {deleteReplyHandler(reply.id)}}>댓글삭제</div>
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </div>

        <form className='qnareply-add-form' onSubmit={replyUploadHandler}>
          <div className='qnareply-add-input'>
            <input
              className='qnareply-add-inputbox'
              type='text'
              placeholder='댓글 쓰기'
              onChange={(e) => setReplyContent(e.target.value)}
            />
          </div>
          <div className='qnareply-add-submit'>
            <button className='qnareply-submit-bt' type="submit">⇧</button>
          </div>
        </form>

        <div className='qnadetail-delete'>
          {username === qna.username || role === 'ROLE_ADMIN' ? (
            <button
              className='category-edit-cancel'
              onClick={() => {
              axiosInstance.delete(`/qna/deleteById/${qna.id}`);
              nav('/')
            }}>QnA 삭제</button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default QnADetail;