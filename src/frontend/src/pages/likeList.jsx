import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../authContext.jsx";
import axiosInstance from "../axiosInstance.jsx";

const LikeList = () => {

  const {username} = useAuth();
  const nav = useNavigate();
  const [likeList, setLikeList] = useState([]);

  useEffect(() => {
    const fetchLikeList = async() => {
      try {
        const response = await axiosInstance.get('/like/fetch');
        setLikeList(response.data);
      } catch (error) {
        console.error("Error Fetching Like List Data");
      }
    };
    fetchLikeList();
  }, [username]);

  const handleRemoveItem = async (title) => {
    try {
      await axiosInstance.delete(`/like/deleteByTitle/${title}`);
      setLikeList(likeList.filter(club => club.title !== title));
      console.log("Club Removed From Like List")
      window.location.reload();
    } catch (error) {
      console.error("Error Removing Club");
    }
  };

  return(
    <div>
      <h4>내가 찜한 동아리</h4>
      <div className=''>
        {Array.isArray(likeList) && likeList.length > 0 ? (
          likeList.map((likedClub) => (
            <div className=''>
              <img className='' src={likedClub.imageUrl} alt="동아리사진" width='80px'
                   onClick={() => nav(`/detail/${likedClub.id}`)}/>
              <div className=''>
                <div className=''>
                  <h4>{likedClub.title}</h4>
                </div>
                <button className="remove" onClick={() => handleRemoveItem(likedClub.title)}>삭제</button>
              </div>
            </div>
          ))
        ) : (
          <p>찜한 동아리가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default LikeList;