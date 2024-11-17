import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInstance.jsx";

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
        <div>
          <div>{club.title}</div>
          <div>{club.description}</div>
          <img src={club.imageUrl} alt="clubImage"/>
        </div>

        <div>
          <input
            type = 'text'
            placeholder = '본인 한 줄 소개'
            value = {intro}
            onChange = {(e)=>{setIntro(e.target.value)}}
          />
        </div>

        <button onClick={SubmitHandler}>제출</button>
      </>
  );

}

export default Application;