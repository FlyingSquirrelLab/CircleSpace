import axios from "axios";

const SeleniumTester = () => {

  const handleTester = async () => {
    const response = await axios.get('/api/parse');
    console.log(response.data);
    console.log(response.status);
  }

  return(
    <div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <button onClick={handleTester}>TEST</button>
    </div>
  )

};

export default SeleniumTester;