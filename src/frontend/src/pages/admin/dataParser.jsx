import React, { useState } from "react";
import axios from "axios";
import './dataParser.css';

const DataParser = () => {
  const [parsedData, setParsedData] = useState(null); // 상태로 데이터 관리
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리

  const handleParser = async () => {
    setLoading(true); // 로딩 시작
    setError(null); // 기존 에러 초기화

    try {
      const response = await axios.get('/api/admin/parse');
      setParsedData(response.data); // 받은 데이터 저장
      console.log(response.data); // 디버깅용
    } catch (err) {
      setError("Error fetching parsed data."); // 에러 메시지 설정
      console.error(err); // 디버깅용
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="adminpage-body">
      <button onClick={handleParser}>Data Parsing</button>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {parsedData && (
        <div className="parsed-data">
          <h3>Parsing Result:</h3>
          <p>{JSON.stringify(parsedData, null, 2)}</p>
        </div>
      )}
    </div>
  );
};

export default DataParser;
