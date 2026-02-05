import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleLogin=async(e)=>{
        e.preventDefault();
        try{
            const response = await fetch(`${API_URL}/auth/login`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            const data = await response.json();
            if (response.ok){
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username)
                toast.success(data.message || `Login Successful ${data.username}`);
                navigate('/')
            }else{
                toast.error(data.message)
            }
        }catch {
            toast.error("Could not connect to server")
        }
    }

    return (
        <form onSubmit={handleLogin}>
        <div className='flex items-center justify-center border w-[500px] h-[400px] mx-auto'>
            <div className='w-md'>
                <h1 className='flex justify-center font-bold text-2xl'>Login</h1>
                <p>Email</p>
                <input type="email" 
                className='border py-1 w-full' 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <p className='mt-2'>Password</p>
                <input type="password" 
                className='border w-full py-1' 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <div className='flex flex-col mx-auto items-center'>
                    <button className='flex mt-1 p-0.5 px-4 font-bold text-white bg-blue-500 rounded-md cursor-pointer mt-2' 
                    type='submit'
                    onClick={handleLogin}
                    >Login</button>
                    <p className='text-blue-500 underline cursor-pointer'>Forgot Password?</p>
                    <Link to={'/signup'}><p className='text-blue-500 underline cursor-pointer'>Sign Up</p></Link>
                </div>
            </div>
        </div>
        </form>
    )
}

export default Login