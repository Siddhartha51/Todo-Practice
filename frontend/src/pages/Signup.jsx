import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSignUp = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            toast.success("Registration Successful")
        } else {
            toast.error(data.message)
        }
    } catch (err) {
        toast.error("Could not connect to server")
    }
}
    return (
        <form onSubmit={handleSignUp}>
            <div className='flex items-center justify-center border w-[500px] h-[400px] mx-auto'>
                <div className='w-md'>
                    <h1 className='flex justify-center font-bold text-2xl'>Sign Up</h1>
                    <p>Username</p>
                    <input type="text"
                        className='border py-1 w-full'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <p>Email</p>
                    <input type="email"
                        className='border py-1 w-full'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className='mt-2'>Password</p>
                    <input type="password"
                        className='border w-full py-1'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className='flex flex-col mx-auto items-center'>
                        <button className='flex mt-1 p-0.5 px-4 font-bold text-white bg-blue-500 rounded-md cursor-pointer mt-2'
                            onClick={handleSignUp}
                            type='submit'
                        >Sign Up</button>
                        <Link to={'/forgotPassword'} className='text-blue-500 underline cursor-pointer'>Forgot Password?</Link>
                        <Link to={'/login'}><p className='text-blue-500 underline cursor-pointer' >Sign In</p></Link>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Signup