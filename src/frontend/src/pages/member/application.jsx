import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInstance.jsx";

const Application = () =>{

  const {id} = useParams();
  const [club, setClub] = useState({});
  const [intro , setIntro] = useState("");

  useEffect(() => {
    try {
      axios.get(`/api/club/getById/${id}`).then((response) => {
        setClub(response.data);
      })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [id]);

  const SubmitHandler = async() => {
    try {
      const response = await axiosInstance.post('/member/application', {
        clubId: id,
        intro: intro
      });
      console.log(response.status);
      console.log(response.data);
      nav('/');
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