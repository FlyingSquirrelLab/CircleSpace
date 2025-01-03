import React from 'react';
import './pageController.css'

const PageController = ({ page, setPage, totalPages }) => {

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  return (
    <div className='pagecontroller' style={{ marginTop: "100px" }}>
      <button className='page-bt' onClick={handlePreviousPage} disabled={page === 0}>
        PREV
      </button>
      <span className='page-span' >
      〈 {page + 1} of {totalPages} 〉
      </span>
      <button className='page-bt' onClick={handleNextPage} disabled={page === totalPages - 1}>
        NEXT
      </button>
    </div>
  );
};

export default PageController;