import React from 'react'
import { AiFillHome } from 'react-icons/ai';
import { FaCommentDots, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className='d-flex'>
         <div className="sidebar">
          <AiFillHome onClick={() => navigate('/')} className="sidebar-icons home-icon" />
          <FaCommentDots onClick={() => navigate('/reviews')} className="sidebar-icons comment-icon" />
          <FaUserCircle onClick={() => navigate('/profile')} className="sidebar-icons user-icon" />
        </div>
        <hr className="vertical-divider" />
      </div>

  )
}

export default Sidebar