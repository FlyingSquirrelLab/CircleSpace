import React, { useState, useEffect } from 'react';
import axios from "axios";
import './categoryManage.css';

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    axios.get('/api/category/getAll')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories', error);
      });
  }, []);

  const handleAddCategory = () => {
    axios.post('/api/admin/category/add', { name: newCategory })
      .then(response => {
        setCategories([...categories, response.data]);
        setNewCategory('');
      })
      .catch(error => {
        console.error('Error adding category', error);
      });
  };

  const handleDeleteCategory = (categoryId) => {
    axios.delete(`/api/admin/category/deleteById/${categoryId}`)
      .then(() => {
        setCategories(categories.filter(category => category.id !== categoryId));
      })
      .catch(error => {
        console.error('Error deleting category', error);
      });
  };

  const handleEditCategory = (categoryId) => {
    // 선택된 카테고리의 이름을 설정하고 수정 모드로 전환
    const category = categories.find(cat => cat.id === categoryId);
    setEditingCategory(categoryId);
    setEditedName(category.name);
  };

  const handleUpdateCategory = (categoryId) => {
    axios.put(`/api/admin/category/updateById/${categoryId}`, { name: editedName })
      .then(response => {
        setCategories(categories.map(category =>
          category.id === categoryId ? response.data : category
        ));
        setEditingCategory(null);
        setEditedName('');
      })
      .catch(error => {
        console.error('Error updating category', error);
      });
  };

  return (
    <div className='categorymanage-body'>
      <div className='categorymanage-title'>카테고리 관리</div>
      <div className='add-categoty'>
        <input
          className='add-category-input'
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="새 카테고리 이름"
        />
        <button className='add-category-bt' onClick={handleAddCategory}>추가</button>
      </div>
      <ul className='categorymanage-list'>
        {categories.map(category => (
          <li key={category.id}>
            {editingCategory === category.id ? (
              <div className='edit-category'>
                <input
                  className='edit-category-input'
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <button className='category-name-edit' onClick={() => handleUpdateCategory(category.id)}>적용</button>
                <button className='category-edit-cancel' onClick={() => setEditingCategory(null)}>취소</button>
              </div>
            ) : (
              <div className='categoryedit-list'>
                <span>{category.name}</span>
                <div className='categoryedit-list-bts'>
                  <button className='category-edit-bt' onClick={() => handleEditCategory(category.id)}>수정</button>
                  <button className='category-delete-bt' onClick={() => handleDeleteCategory(category.id)}>삭제</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManage;
