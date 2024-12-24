import React, {useEffect, useState} from "react";
import axios from "axios";
import axiosInstance from "../../axiosInstance.jsx";
import {useAuth} from "../../authContext.jsx";
import {useNavigate, useParams} from "react-router-dom";
import './uploadReview.css';

const UploadReview = () => {

  const {id} = useParams();
  const {username, role} = useAuth();
  const [reviewContent, setReviewContent] = useState('');
  const [image, setImage] = useState('');
  const [uploadImg, setUploadImg] = useState(false)
  const [club, setItem] = useState({});
  const nav = useNavigate()

  useEffect(() => {
    const getClub = async () => {
      try {
        const response = await axios.get(`/api/club/getById/${id}`);
        console.log(response.status);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getClub();
  }, [id]);

  const toggleUploadImg = () => {
    setUploadImg(uploadImg !== true);
  };

  const handleReviewImageChange = (e) => {
    setImage((e.target.files[0]));
  };

  const reviewUploadHandler = async (e) => {
    e.preventDefault();

    try {
      let path = null;

      if (image) {
        path = `${Date.now()}-${image.name}`;
        const preSignedUrlResponse = await axios.post('/api/s3/getPreSignedUrl', { path });
        const preSignedUrl = preSignedUrlResponse.data.url;

        await axios.put(preSignedUrl, image, {
          headers: {
            'Content-Type': image.type
          }
        });
      }

      const reviewData = {
        clubId: id,
        reviewContent,
        ...(path && { imagePath: path }), // 이미지가 있을 때만 imagePath 포함
      };

      await axiosInstance.post('/review/add', reviewData);
      nav('/myPage');
    } catch (error) {
      console.error('Error uploading Review', error);
    }
  };


  return (
    <>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <div>
        <div className='temlist'>
          <img className='temlist-img' src={club.imageUrl} alt="" width='80px'/>
          <div className='tem-inf-handle'>
            <div className='temlist-text'>
              <h4>{club.title}</h4>
            </div>
          </div>
        </div>

        <form className='upload-review-body' onSubmit={reviewUploadHandler}>
          <div lang='ko' className='upload-review-container'>
            <textarea
              className='upload-review-input'
              type='text'
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder='내용을 입력해주세요'
            />
          </div>

          <div className='upload-review-img'>
            <p onClick={toggleUploadImg}>PHOTO</p>
            <input
              lang='ko'
              className='upload-review-file'
              type="file"
              onChange={handleReviewImageChange}
            />
          </div>

          <div className='submit-review'>
            <button className='submit-review-bt' type="submit">WRITE</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UploadReview;