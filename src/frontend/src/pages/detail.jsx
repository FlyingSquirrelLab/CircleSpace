import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

const Detail=()=>{

  const {id} = useParams();

  const [title, setTitle] = useState('');
  const [clubImg, setClubImg] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchClubDetail = async () => {
      try {
        const response = await axios.get(`/api/club/detail/${id}`)
        console.log(response);
        setTitle(response.data.title);
        setClubImg(response.data.detailImage);
        setDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchClubDetail();
  }, [id]);

  return(
    <div>
      <img src={clubImg} alt="아이템사진"/>
      <h4 className='item-title'>{title}</h4>
      <p className='item-description'>{description}</p>
    </div>
  );
}

export default Detail;