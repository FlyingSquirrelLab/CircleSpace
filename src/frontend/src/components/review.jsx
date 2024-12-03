import React, {useEffect, useState} from "react";
import {useAuth} from "../AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import axiosInstance from "../axiosInstance.jsx";
import './review.css'

const Review = ({id}) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const {username, role} = useAuth();
  const nav = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    axios.get(`/api/review/fetchByClubId/${id}`).then((response) => {
      setReviews(response.data);
    })
  }, [id]);

  const handleReviewImageChange = (e) => {
    setImage((e.target.files[0]));
  };

  const reviewUploadHandler = async (e) => {
    e.preventDefault();

    try {
      const path = `${Date.now()}-${image.name}`;
      const preSignedUrlResponse = await axios.post('/api/s3/getPreSignedUrl', { path });
      const preSignedUrl = preSignedUrlResponse.data.url;

      await axios.put(preSignedUrl, image, {
        headers: {
          'Content-Type': image.type
        }
      });

      const reviewData = {
        clubId: id,
        reviewContent,
        imagePath: path,
      };

      await axiosInstance.post('/review/add', reviewData);
      nav('/');
    } catch (error) {
      console.error('Error uploading Review', error);
    }
  };

  const deleteReviewHandler = async (reviewId) => {
    try {
      await axios.delete(`/api/review/deleteById/${reviewId}`);
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review', error);
    }
  };

  return (
    <div className='review-body'>
      <p className='review-title'>REVIEW</p>
      <div className='review-contents'>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className='review-1'>
              <div className='reiview-container'>
                <div className='review-head'>
                  <div className='reviewer'><p className='review-displayname'>{review.displayName}</p>님의 리뷰</div>
                  <p className='createdate'>{formatDate(review.createdAt)}</p>
                </div>
                <div className='review-tail'>
                  <div className='review-content'>
                    <p>{review.content}</p>
                    <img className='review-img' src={review.imageUrl}/>
                  </div>
                  {username === review.username || role === 'ROLE_ADMIN' ? (
                    <p className='review-delete' onClick={() => {
                      deleteReviewHandler(review.id)
                    }}>후기삭제</p>
                  ) : (
                    <></>
                  )}
                </div>

              </div>

            </div>
          ))
        ) : (
          <p>후기가 없습니다.</p>
        )}
      </div>
      <form className='upload-review-body' onSubmit={reviewUploadHandler}>
        <p className='upload-review-title'>리뷰 작성</p>
        <div className='upload-review-container'>
          <textarea
            className='upload-review-input'
            type='text'
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder='내용을 입력해주세요'
          />
        </div>
        <div className='upload-review-img'>
          <p>사진 업로드</p>
          <input
            className='upload-review-file'
            type="file"
            onChange={handleReviewImageChange}
          />
        </div>
        <div className='submit-review'>
          <button className='submit-review-bt' type="submit">작성완료</button>
        </div>
      </form>
    </div>
  );

}

export default Review;