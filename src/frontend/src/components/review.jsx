import React, {useEffect, useState} from "react";
import {useAuth} from "../authContext.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import axiosInstance from "../axiosInstance.jsx";

const Review = ({id}) => {

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
    <>
      <div>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className=''>
              <div className=''>
                <p>{review.displayName}</p>
                <p>{review.content}</p>
                <p>{review.createdAt}</p>
              </div>
              {username === review.username || role === 'ROLE_ADMIN' ? (
                <p onClick={() => {
                  deleteReviewHandler(review.id)
                }}>후기삭제</p>
              ) : (
                <></>
              )}
            </div>
          ))
        ) : (
          <p>후기가 없습니다.</p>
        )}
      </div>
      <form className='' onSubmit={reviewUploadHandler}>
        <div className=''>
          <p>내용</p>
          <input
            type='text'
            onChange={(e) => setReviewContent(e.target.value)}
          />
        </div>
        <div className=''>
          <p>이미지</p>
          <div className=''>
            <input
              type="file"
              onChange={handleReviewImageChange}
            />
          </div>
        </div>
        <div className=''>
          <button className='' type="submit">업로드</button>
        </div>
      </form>
    </>
  );

}

export default Review;