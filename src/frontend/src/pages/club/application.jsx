import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInstance.jsx";
import './application.css';

const Application = () =>{

  const {id} = useParams();
  const [club, setClub] = useState({});
  const [intro , setIntro] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const getClub = async () => {
      try {
        const response = await axios.get(`/api/club/getById/${id}`);
        setClub(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getClub();
  }, [id]);

  const SubmitHandler = async() => {
    try {
      const response = await axiosInstance.post('/membership/application', {
        clubId: id,
        intro: intro
      });
      console.log(response.status);
      console.log(response.data);
      if (response.status === 200){
        nav('/');
      }
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
      <>
        <div className='editor-body'>
          <div className='editor-container'>
            <div className='head'>
              <div className='title-img'>
                <h2>동아리 지원하기 : {club.title}</h2>
                <img width='150' src={club.imageUrl} alt="clubImage"/>
              </div>
              <p className='club-description'>{club.description}</p>
              <p className='club-description'>모집 일정 : {club.period}</p>
              <p className='club-description'>회비 안내 : {club.fee}</p>
              <p className='club-description'>모집 대상 : {club.target}</p>
              <p className='club-description'>유의사항 : {club.note}</p>
              <p className='club-description'>주요 활동 : {club.activity}</p>
            </div>

            <div className='edit-inputs'>
              <div className='head'>
                <input
                    className='editor-title'
                    type='text'
                    placeholder='본인 한 줄 소개'
                    value={intro}
                    onChange={(e) => {
                      setIntro(e.target.value)
                    }}
                />
              </div>
              <button className='editor-summitbutton' onClick={SubmitHandler}>제출</button>
            </div>

          </div>
        </div>
      </>
  );

}

export default Application;