import axios from "axios";
import './dataParser.css'

const DataParser = () => {

  const handleParser = async () => {
    const response = await axios.get('/api/admin/parse');
    console.log(response.data);
    console.log(response.status);
  }

  return(
    <div className='adminpage-body'>
      <button onClick={handleParser}>Data Parsing</button>
    </div>
  )

};

export default DataParser;