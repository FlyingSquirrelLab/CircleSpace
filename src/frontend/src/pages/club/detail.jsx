import React, { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../authContext.jsx";
import axios from 'axios'
import blankLike from '../../assets/blank_like.png'
import filledLike from '../../assets/filled_like.png'
import blankStar from '../../assets/blankStar.png'
import filledStar from '../../assets/filledStar.png'
import axiosInstance from "../../axiosInstance.jsx";
import Review from "../../components/review.jsx";
import './detail.css';

const Detail=()=>{

  const {id} = useParams();
  const nav= useNavigate();
  const {username, role} = useAuth();
  const [club, setClub] = useState({})

  const [title, setTitle] = useState('');
  const [liked, setLiked] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [detailImageList, setDetailImageList] = useState([]);

  const [categories, setCategories] = useState([]);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    try {
      axios.get(`/api/club/getById/${id}`).then((response) => {
        setClub(response.data);
        setTitle(response.data.title);
        setDetailImageList(response.data.detailImages);
        setCategories(response.data.categories);
        setUniversities(response.data.universities);
      })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [id]);

  useEffect(() => {
    if (username === '') {
      setLiked(false);
    } else {
      axiosInstance.get(`/like/check/${id}`).then((response) => {
        setLiked(response.data.liked);
      });
    }
  }, [username, id]);

  useEffect(() => {
    axios.get(`/api/club/checkFeatured/${id}`).then((response) => {
      setFeatured(response.data.featured)
    });
  }, [id]);

  const handleLikeClick = async () => {
    if (username === '') {
      nav('/login');
    } else {
      try {
        if (liked) {
          await axiosInstance.delete(`/like/deleteByTitle/${encodeURIComponent(title)}`);
          setLiked(false);
        } else {
          await axiosInstance.post(`/like/addByTitle/${encodeURIComponent(title)}`);
          setLiked(true);
        }
      } catch (error) {
        console.error("Error toggling like", error);
      }
    }
  };

  const handleFeatureClick = async () => {
    try {
      if (featured) {
        await axios.put(`/api/admin/unfeatureClubById/${id}`);
        setFeatured(false);
      } else {
        await axios.put(`/api/admin/featureClubById/${id}`);
        setFeatured(true);
      }
    } catch (error) {
      console.error("Error toggling feature", error);
    }
  };

  return(
    club && (
      <div className="detail-body">
        {
          role === "ROLE_ADMIN" ?
            <div className='detail-edit-bn'>
              <button className='edit-button'
                      onClick={() => nav(`/editClub/${club.id}`)}
              >동아리 수정하기</button>
              <div className='feature-bn'>
                <img
                  src={featured ? filledStar : blankStar}
                  width='20px'
                  height='20px'
                  onClick={handleFeatureClick}
                  alt="Feature Button"
                />
              </div>
            </div> : <p></p>
        }
        <div className="detail-container">
          <img className='club-img' src={club.imageUrl} alt="동아리 대표이미지"/>
          <div className='detail-contents'>
            <div className='detail-box'>
              <h4 className='club-title'>{club.title}</h4>
              <p className='club-description'>{club.description}</p>
            </div>
            <div>
              <div>
                <p>소속 카데고리</p>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <p key={category.id}>{category.name}</p>
                ))
              ) : (
                <p></p>
              )}
              </div>
              <div>
                <p>소속 대학교</p>
                {Array.isArray(universities) && universities.length > 0 ? (
                  universities.map((university) => (
                    <p key={university.id}>{university.title}</p>
                  ))
                ) : (
                  <p></p>
                )}
              </div>
            </div>
            <div>
              <button onClick={()=>{
                nav(`/application/${id}`);
              }}>지원하기</button>
            </div>
            <div className='wishlist'>
              <p>관심동아리 등록</p>
              <img
                src={liked ? filledLike : blankLike}
                width='18px'
                height='18px'
                onClick={handleLikeClick}
                alt="Like Button"
              />
            </div>
          </div>
        </div>
        <br/><br/>
        <div>
          {detailImageList.length > 0 ? (
            detailImageList.map((image, index) => (
              <img key={index} src={image.imageUrl} alt={`Detail ${index + 1}`} className="detail-image"/>
            ))
          ) : (
            <p>상세 이미지가 없습니다.</p>
          )}
        </div>
        <Review id={id}/>
      </div>
    )
  )
}

export default Detail;