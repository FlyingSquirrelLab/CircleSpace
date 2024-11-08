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

  const [universities, setUniversities] = useState([]);
  const [availableUniversities, setAvailableUniversities] = useState([]);

  useEffect(() => {
    axios.get(`/api/club/getById/${id}`)
      .then((response) => {
        setClub(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setImagePath(response.data.imageUrl);

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

      const clubData = {
        title,
        description,
        imagePath: updatedImagePath,
        categoryNames: categories,
        universityTitles: universities
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
              <p>설명</p>
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

        <div className='edit-buttons'>
          <button className='delete-bt' onClick={handleDelete}>동아리 삭제</button>
          <button className='editor-summitbutton' type="submit">동아리 수정</button>
        </div>
      </form>
    </div>
  )
}

export default EditClub;