import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const UploadClub = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [detailImageList, setDetailImageList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

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
          categoryNames: categories
        };

        await axios.post('/api/club/upload', clubData);
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
        <h4>추가하실 상품 정보를 입력하세요</h4>
        <div className='editor-container'>
          <div className='edit-inputs'>
            <div className='head'>
              <p>동아리 이름</p>
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
              <p>동아리 설명</p>
              <textarea
                className='editor-description'
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className='head'>
              <p>카테고리 선택</p>
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
              <p>대표 이미지</p>
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
              <p>상세 이미지</p>
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