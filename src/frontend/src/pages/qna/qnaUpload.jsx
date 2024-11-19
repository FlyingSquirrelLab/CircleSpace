import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInstance.jsx";
import './qnaUpload.css'
import '../club/uploadClub.css'

const QnAUpload = () => {

  const nav = useNavigate();
  const [content, setContent] = useState("");
  const [qnaTitle, setQnATitle] = useState("");
  const [image, setImage] = useState('');

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
    <div className='editor-body'>
      <form className='editor-form' onSubmit={qnaUploadHandler}>
        <h2>게시글 작성하기</h2>
        <div className='editor-container'>

          <p>제목</p>
          <input
            className='editor-title'
            type='text'
            onChange={(e) => setQnATitle(e.target.value)}
          />
        </div>
        <div className=''>
          <p>내용</p>
          <input
            className='editor-description'
            type='text'
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className=''>
          <p>이미지</p>
          <div className=''>
            <input
              className='editor-file'
              type="file"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className='editor-button'>
          <button className='editor-summitbutton' type="submit">업로드</button>
        </div>
      </form>
    </div>
  );
};

export default QnAUpload;