import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInstance.jsx";

const QnAUpload = () => {

  const nav = useNavigate();
  const [content, setContent] = useState("");
  const [qnaTitle, setQnATitle] = useState("");
  const [image, setImage] = useState(null);

  const qnaUploadHandler = async (e) => {
    e.preventDefault();

    try {
      const path = `${Date.now()}-${image.name}`;
      const preSignedUrlResponse = await axios.post('/api/s3/getPreSignedUrl', { path });
      const preSignedUrl = preSignedUrlResponse.data.url;

      await axios.put(preSignedUrl, image, {
        headers: {
          'Content-Type': image.type
        }
      });

      const qnaData = {
        qnaTitle,
        content,
        imagePath: path,
      };

      await axiosInstance.post('/qna/add', qnaData);
      nav('/');
    } catch (error) {
      console.error('Error uploading QnA', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
    <form className='' onSubmit={qnaUploadHandler}>
    <div className=''>
      <p>제목</p>
      <input
        type='text'
        onChange={(e) => setQnATitle(e.target.value)}
      />
    </div>
    <div className=''>
      <p>내용</p>
      <input
        type='text'
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
    <div className=''>
      <p>이미지</p>
      <div className=''>
        <input
          type="file"
          onChange={handleImageChange}
        />
      </div>
    </div>
      <div className=''>
        <button className='' type="submit">업로드</button>
      </div>
    </form>
    </>
  );
};

export default QnAUpload;