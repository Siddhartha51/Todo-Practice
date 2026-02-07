import React, { useState } from 'react'
import Todo from './pages/Todo'
import {Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/header'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'


function App() {
  const [searchTerm, setSearchTerm]= useState("");

  return (
      <div>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/todo' element={<Todo searchTerm={searchTerm}/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route path='/reset-Password/:token' element={<ResetPassword />} />
        </Routes>
      </div>
      
    
  )
}

export default App