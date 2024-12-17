import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GiChickenLeg } from "react-icons/gi";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reset = () => {
    const { resetToken } = useParams(); // Get resetToken from the URL
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:4000/api/password/reset/${resetToken}`, {
                password,
                confirmPassword,
            });

            toast.success(response.data.message || "Password reset successful!");
            navigate("/signin"); // Redirect to the login page
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className='flex items-center p-2 justify-center mt-10'>
            <form className='form-container' onSubmit={handleSubmit}>
                <div className='flex items-center gap-1'>
                    <span><GiChickenLeg size={30} className='text-primary' /></span>
                    <h1 className='logo'>Tasty Bites</h1>
                </div>
                <h1 className='text-center'>Create New Password</h1>
                <input
                    className='inputBox'
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    className='inputBox'
                    type='password'
                    name='confirmPassword'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type='submit' className='button'>Save Changes</button>
            </form>
        </div>
    );
};

export default Reset;
