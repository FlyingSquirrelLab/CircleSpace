import { useNavigate } from 'react-router-dom';
import './list.css';

const List =({club})=>{

  const nav = useNavigate();

  return(
    <div className='list-body'>
      <div className='list' onClick={()=>nav(`/detail/${club.id}`)}>
        <img className='list-img' src={club.imageUrl} alt="동아리대표이미지" />
        <div className='list-text'>
          {/*<p className='list-description'>{club.description}</p>*/}
          <h5>{club.title}</h5>
        </div>
      </div>
    </div>
  )
}

export default List;