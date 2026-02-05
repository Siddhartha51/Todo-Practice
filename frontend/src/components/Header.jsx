import React from 'react'
import { Link } from 'react-router-dom'
import Search from './Search'

function Header({searchTerm, setSearchTerm}) {
  return (
    <nav>
    <div className='border p-3 '>
        <div className='flex gap-3 items-center justify-center'>
            <Link to='/'>Home</Link>
            <Link to='/todo' >Todo</Link>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </div>
    </div>
    </nav>
  )
}

export default Header