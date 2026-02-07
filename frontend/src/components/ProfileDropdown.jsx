import React, { useState, useEffect, useRef } from 'react';
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate=useNavigate();

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = ()=>{
    localStorage.removeItem('token')
    toast.info('Logged out successfully')
    navigate('/login')
  }

  return (
    <div 
      className="relative inline-block" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Profile Logo / Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        <CgProfile size={35}/>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
          <a href="" className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition-colors">
            My Profile
          </a>
          <a href="#settings" className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition-colors">
            Settings
          </a>
          <div className="border-t border-gray-100 my-1"></div>
          <button 
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;