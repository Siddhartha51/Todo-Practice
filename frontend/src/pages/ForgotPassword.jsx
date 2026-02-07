import React, { useState } from 'react';
import { toast } from 'react-toastify';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Connection failed");
        }
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <form onSubmit={handleSubmit} className="border p-10 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                <p className="mb-2 text-sm text-gray-600">Enter your email to receive a reset link.</p>
                <input 
                    type="email" 
                    className="border w-full p-2 mb-4" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Send Reset Link
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;