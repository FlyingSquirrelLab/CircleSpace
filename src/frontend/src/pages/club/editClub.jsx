import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const EditClub = () => {

  const nav = useNavigate();
  const {id} = useParams();
  const [club, setClub] = useState({})

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState('');

  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [originalDetailImages, setOriginalDetailImages] = useState([]);
  const [newDetailImages, setNewDetailImages] = useState([]);

  const [universities, setUniversities] = useState([]);
  const [availableUniversities, setAvailableUniversities] = useState([]);

  const [period, setPeriod] = useState('');
  const [fee, setFee] = useState('');
  const [target, setTarget] = useState('');
  const [note, setNote] = useState('');
  const [activity, setActivity] = useState('');
  const [contact, setContact] = useState('');
  const [united, setUnited] = useState(false);

  useEffect(() => {
    axios.get(`/api/club/getById/${id}`)
      .then((response) => {
        setClub(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setImagePath(response.data.imageUrl);

        setOriginalDetailImages(response.data.detailImages.map(detailImage => detailImage.imageUrl));

        setPeriod(response.data.period);
        setFee(response.data.fee);
        setTarget(response.data.target);
        setNote(response.data.note);
        setActivity(response.data.activity);
        setContact(response.data.contact);
        setUnited(response.data.united);

        const assignedCategories = response.data.categories.map(category => category.name);
        setCategories(assignedCategories);

        const assignedUniversities = response.data.universities.map(university => university.title);
        setUniversities(assignedUniversities);
      }).catch (error => {
      console.error('Error fetching data:', error);
    });
  }, [id]);

  useEffect(() => {
    axios.get('/api/category/getAll')
      .then(response => {
        setAvailableCategories(response.data);
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

  const handleDelete = () => {
    if (window.confirm("동아리를 삭제하시겠습니까?")) {
      axios.delete(`/api/club/delete/${club.id}`)
        .then(() => {
          nav('/');
        })
        .catch(error => {
          console.error('Error deleting club:', error);
        });
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleRemoveDetailImage = (index) => {
    setOriginalDetailImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleNewDetailImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDetailImages([...newDetailImages, file]); // 새로운 이미지 파일 추가
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      let updatedImagePath = imagePath;

      if (image) {
        const path = `${Date.now()}-${image.name}`;
        const preSignedUrlResponse = await axios.post('/api/s3/getPreSignedUrl', {path});
        const preSignedUrl = preSignedUrlResponse.data.url;
        console.log(preSignedUrl);

        await axios.put(preSignedUrl, image, {
          headers: {
            'Content-Type': image.type
          }
        });
        updatedImagePath = path;
      }

      const newDetailImagePaths = await Promise.all(newDetailImages.map(async (image) => {
        const detailPath = `${Date.now()}-${image.name}`;
        const preSignedDetailUrlResponse = await axios.post('/api/s3/getPreSignedUrl', { path: detailPath });
        const preSignedDetailUrl = preSignedDetailUrlResponse.data.url;
        await axios.put(preSignedDetailUrl, image, { headers: { 'Content-Type': image.type } });
        return detailPath;
      }));

      const clubData = {
        title,
        description,
        imagePath: updatedImagePath,
        categoryNames: categories,
        universityTitles: universities,
        originalDetailImagePaths: originalDetailImages,
        newDetailImagePaths,
        united,
        period,
        fee,
        target,
        note,
        activity,
        contact
      };

      const response = await axios.put(`/api/club/edit/${club.id}`, clubData);
      console.log("동아리 수정 성공");
      console.log(response.data);
      nav('/');
    } catch (error) {
      console.error('Error uploading club', error);
    }
  };

  return (
    <div className='editor-body'>
      <form className='editor-form' onSubmit={handleSubmit}>
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
          </div>
          <div className='editor-imgbox'>
            <img className='editor-img' src={imagePath} alt="대표사진" width="180px"/>
            <input
              className='editor-file'
              type="file"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div>
          <p>상세 이미지</p>
          {originalDetailImages.map((imageUrl, index) => (
            <div key={index}>
              <img src={imageUrl} alt="상세 이미지" width="180px"/>
              <button type="button" onClick={() => handleRemoveDetailImage(index)}>삭제</button>
            </div>
          ))}
          {newDetailImages.map((file, index) => (
            <div key={`new-${index}`}>
              <p>{file.name}</p>
            </div>
          ))}
          <input type="file" onChange={handleNewDetailImageChange}/>
        </div>

        <div className='edit-buttons'>
          <button className='delete-bt' onClick={handleDelete}>동아리 삭제</button>
          <button className='editor-summitbutton' type="submit">동아리 수정</button>
        </div>
      </form>
    </div>
  )
}

export default EditClub;