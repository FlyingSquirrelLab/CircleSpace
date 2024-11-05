import React, { useState, useEffect } from 'react';
import axios from "axios";
import './manageUniversity.css';

const ManageUniversity = () => {
  const [universities, setUniversities] = useState([]);
  const [editingUniversity, setEditingUniversity] = useState(null);

  const [editedTitle, setEditedTitle] = useState('');
  const [editedCode, setEditedCode] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    axios.get('/api/university/getAll')
      .then(response => {
        setUniversities(response.data);
      })
      .catch(error => {
        console.error('Error fetching universities', error);
      });
  }, []);

  const handleAddUniversity = () => {
    axios.post('/api/admin/university/add', {
      title: newTitle,
      code : newCode
    })
      .then(response => {
        setUniversities([...universities, response.data]);
        setNewTitle('');
        setNewCode('');
      })
      .catch(error => {
        console.error('Error adding university', error);
      });
  };

  const handleDeleteUniversity = (universityId) => {
    axios.delete(`/api/admin/university/deleteById/${universityId}`)
      .then(() => {
        setUniversities(universities.filter(university => university.id !== universityId));
      })
      .catch(error => {
        console.error('Error deleting university', error);
      });
  };

  const handleEditUniversity = (universityId) => {
    const university = universities.find(cat => cat.id === universityId);
    setEditingUniversity(universityId);
    setEditedTitle(university.title);
    setEditedCode(university.code);
  };

  const handleUpdateUniversity = (universityId) => {
    axios.put(`/api/admin/university/updateById/${universityId}`, {
      title: editedTitle,
      code: editedCode
    }).then(response => {
        setUniversities(universities.map(university =>
          university.id === universityId ? response.data : university
        ));
        setEditingUniversity(null);
        setEditedTitle('');
        setEditedCode('');
      })
      .catch(error => {
        console.error('Error updating university', error);
      });
  };

  return (
    <div className='universitymanage-body'>
      <div className='universitymanage-title'>대학교 관리</div>
      <div className='add-university'>
        <input
          className='add-university-input'
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="새 대학교 이름"
        />
        <input
          className='add-university-input'
          type="text"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          placeholder="새 대학교 코드"
        />
        <button className='add-university-bt' onClick={handleAddUniversity}>추가</button>
      </div>
      <ul className='universitymanage-list'>
        {universities.map(university => (
          <li key={university.id}>
            {editingUniversity === university.id ? (
              <div className='edit-university'>
                <input
                  className='edit-university-input'
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <input
                  className='edit-university-input'
                  type="text"
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value)}
                />
                <button className='university-name-edit' onClick={() => handleUpdateUniversity(university.id)}>적용
                </button>
                <button className='university-edit-cancel' onClick={() => setEditingUniversity(null)}>취소</button>
              </div>
            ) : (
              <div className='universityedit-list'>
                <div>{university.title}</div>
                <div>{university.code}</div>
                <div className='universityedit-list-bts'>
                  <button className='university-edit-bt' onClick={() => handleEditUniversity(university.id)}>수정</button>
                  <button className='university-delete-bt' onClick={() => handleDeleteUniversity(university.id)}>삭제
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageUniversity;
