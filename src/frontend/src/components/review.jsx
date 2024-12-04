import React, {useEffect, useState} from "react";
import {useAuth} from "../authContext.jsx";
import axios from "axios";
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
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`/api/review/fetchByClubId/${id}`).then((response) => {
      setReviews(response.data);
    })
  }, [id]);

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
                    {review.imageUrl ? <img className='review-img' src={review.imageUrl} alt=''/> : <></>}
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
    </div>
  );

}

export default Review;