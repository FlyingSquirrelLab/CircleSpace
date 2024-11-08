import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import './uploadClub.css';
import axiosInstance from "../../axiosInstance.jsx";

const UploadClub = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [detailImageList, setDetailImageList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [universities, setUniversities] = useState([]);
  const [availableUniversities, setAvailableUniversities] = useState([]);

  const nav = useNavigate();

  useEffect(() => {
    axios.get('/api/category/getAll')
      .then(response => {
        setAvailableCategories(response.data);
        const allCategory = response.data.find(category => category.name === 'ALL');
        if (allCategory) {
          setCategories(prev => [...prev, allCategory.name]);
        }
      })
      .catch(error => {
        console.error('Error fetching categories', error);
      });
  }, []);

  useEffect(() => {
    axios.get('/api/university/getAll')
      .then(response => {
        setAvailableUniversities(response.data);
      })
      .catch(error => {
        console.error('Error fetching universities', error);
      });
  }, []);

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleDetailImageChange = (index, e) => {
    const files = [...detailImageList];
    files[index] = e.target.files[0];
    setDetailImageList(files);
  };

  const addDetailImageField = () => {
    setDetailImageList([...detailImageList, null]);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategories(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const handleUniversityChange = (e) => {
    const value = e.target.value;
    setUniversities(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      console.error('Image file is required');
    } else {
      try {
        const path = `${Date.now()}-${mainImage.name}`;
        const preSignedUrlResponse = await axios.post('/api/s3/getPreSignedUrl', { path });
        console.log("Presigned Url Get");
        const preSignedUrl = preSignedUrlResponse.data.url;
        console.log(preSignedUrl);

        await axios.put(preSignedUrl, mainImage, {
          headers: {
            'Content-Type': mainImage.type
          }
        });

        const detailImagePaths = await Promise.all(detailImageList.map(async (image, index) => {
          if (image) {
            const detailPath = `${Date.now()}-detail-${index}-${image.name}`;
            const preSignedDetailUrlResponse = await axios.post('/api/s3/getPreSignedUrl', { path: detailPath });
            const preSignedDetailUrl = preSignedDetailUrlResponse.data.url;
            await axios.put(preSignedDetailUrl, image, {
              headers: {
                'Content-Type': image.type
              }
            });
            return detailPath;
          }
          return null;
        }));

        const clubData = {
          title,
          description,
          imagePath: path,
          detailImagePaths: detailImagePaths.filter(path => path !== null),
          categoryNames: categories,
          universityTitles: universities
        };

        await axiosInstance.post('/club/upload', clubData);
        console.log("동아리 등록 성공");
        nav('/');
      } catch (error) {
        console.error('Error uploading club', error);
      }
    }
  };

  return (
    <div className='editor-body'>

      <form className='editor-form' onSubmit={handleSubmit}>
        <div style={{background:"rgb(244,213,108)", paddingRight: "25px",paddingLeft: "25px", borderRadius: "10px"}}>
          <h2>동아리 등록하기</h2>
        </div>
        <div className='editor-container'>
          <div className='edit-inputs'>
            <div className='head'>
              <h4>동아리 이름</h4>
              <input
                className='editor-title'
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className='head'>
              <h4>동아리 설명</h4>
              <textarea
                className='editor-description'
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className='head'>
              <h4>카테고리 선택</h4>
              <div className='editor-categories'>
                {availableCategories.map(category => (
                  <label key={category.id}>
                    <input
                      type="checkbox"
                      value={category.name}
                      onChange={handleCategoryChange}
                      checked={categories.includes(category.name)}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>
            <div className='head'>
              <h4>소속 대학교 선택</h4>
              <div className='editor-categories'>
                {availableUniversities.map(university => (
                  <label key={university.id}>
                    <input
                      type="checkbox"
                      value={university.title}
                      onChange={handleUniversityChange}
                      checked={universities.includes(university.title)}
                    />
                    {university.title}
                  </label>
                ))}
              </div>
            </div>
            <div className='head'>
              <h4>대표 이미지</h4>
              <div className='editor-imgbox'>
                <input
                  className='editor-file'
                  type="file"
                  onChange={handleMainImageChange}
                  required
                />
              </div>
            </div>
            <div className='head'>
              <h4>상세 이미지</h4>
              {detailImageList.map((_, index) => (
                <div key={index} className='editor-imgbox'>
                  <input
                    className='editor-file'
                    type="file"
                    onChange={(e) => handleDetailImageChange(index, e)}
                  />
                </div>
              ))}
              <button type="button" onClick={addDetailImageField}>상세 이미지 추가</button>
            </div>
          </div>
        </div>
        <div className='editor-button'>
          <button className='editor-summitbutton' type="submit">동아리 등록</button>
        </div>
      </form>
    </div>
  )
}

export default UploadClub;