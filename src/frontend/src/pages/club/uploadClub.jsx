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

  const [period, setPeriod] = useState('');
  const [fee, setFee] = useState('');
  const [target, setTarget] = useState('');
  const [note, setNote] = useState('');
  const [activity, setActivity] = useState('');
  const [contact, setContact] = useState('');
  const [united, setUnited] = useState(false);

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
          universityTitles: universities,
          united,
          period,
          fee,
          target,
          note,
          activity,
          contact
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
        <div >
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
              <h4>모집 기간</h4>
              <input
                className='editor-title'
                type="text"
                placeholder="모집 기간"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>
            <div className='head'>
              <h4>회비 안내</h4>
              <input
                className='editor-title'
                type="text"
                placeholder="회비 안내"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>
            <div className='head'>
              <h4>모집 대상</h4>
              <input
                className='editor-title'
                type="text"
                placeholder="모집 대상"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div className='head'>
              <h4>유의 사항</h4>
              <input
                className='editor-title'
                type="text"
                placeholder="유의 사항"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className='head'>
              <h4>주요 활동</h4>
              <input
                className='editor-title'
                type="text"
                placeholder="주요 활동"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
            </div>
            <div className='head'>
              <h4>문의처</h4>
              <input
                className='editor-title'
                type="text"
                placeholder="문의처"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className='head'>
              <h4>연합동아리 여부</h4>
              <input
                type="checkbox"
                checked={united}
                onChange={(e) => setUnited(e.target.checked)}
              />
              <label>연합동아리</label>
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