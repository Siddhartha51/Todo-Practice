import React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function ResetPassword() {
    const  [password, setPassword] = useState("");
    const {token} = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/reset-password/${token}`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({password})
            })

            const data = await response.json();

            if (response.ok) {
                toast.success("Password updated! Please Login");
                navigate('/login')
            } else{
                toast.error(data.message)
            }
        } catch (err) {
            toast.error("Something went wrong")
        }
    }

  return (
    <div className='flex flex-col items-center mt-20'>
        <form onSubmit={handleSubmit} className='border p-10 rounded shadow-lg w-96'>
            <h2 className='text-xl font-bold mb-4'>Create New Password</h2>
            <input type="password"
            className='border w-full p-2 mb-4' 
            placeholder='New Password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            />
            <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded w-full'>
                Update Password
            </button>
        </form>
    </div>
  )
}

export default ResetPassword