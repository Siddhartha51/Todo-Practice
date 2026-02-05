import React from 'react'
import { FiSearch } from "react-icons/fi";

function Search({searchTerm, setSearchTerm}) {
  return (
    <div className='relative flex items-center'>
        <FiSearch className='absolute right-2'/>
        <input type="text" 
        placeholder='Search Todo' 
        className='border rounded-md py-2 pl-2 w-[130px]'
        value={searchTerm}
        onChange={(e)=> setSearchTerm(e.target.value)}
        />
        
        </div>
   
  )
}

export default Search