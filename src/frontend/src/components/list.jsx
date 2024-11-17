import { useNavigate } from 'react-router-dom';
import './list.css';

const List = ({ club }) => {
  const nav = useNavigate();

  return (
    <div className='clublist-body'>
      <div className='clublist' onClick={() => nav(`/detail/${club.id}`)}>
        <img className='clublist-img' src={club.imageUrl} alt="동아리대표이미지" />
        <div className='clublist-text'>
          {/*<p className='clublist-description'>{club.description}</p>*/}
          <h5>{club.title}</h5>
        </div>
      </div>
    </div>
  );
};

export default List;
