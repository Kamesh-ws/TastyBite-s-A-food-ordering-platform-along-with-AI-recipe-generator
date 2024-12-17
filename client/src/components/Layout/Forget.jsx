import React, { useState } from 'react';
import { GiChickenLeg } from "react-icons/gi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Forget = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); 
   
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        try {
            const response = await axios.post('http://localhost:4000/api/password/forget', { email });
            toast.success(response.data.message); // Show success message
            navigate(`/password/reset/${response.data.resettoken}`)
            // Clear any previous errors
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred'); // Handle error message
        }finally {
            setLoading(false); // Hide loading after the request is completed
        }
    };

    return (
        <div className='flex items-center p-2 justify-center mt-10'>
            <form className='form-container' onSubmit={handleSubmit}>
                <div className='flex items-center gap-1'>
                    <span><GiChickenLeg size={30} className='text-primary' /></span>
                    <h1 className='logo'>Tasty Bites</h1>
                </div>
                <h1 className='text-center'>Password Assistance</h1>
                
                <input
                    className='inputBox'
                    type='email'
                    name='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type='submit' className='button' disabled={loading}>
                    {loading ? 'Submitting...' : 'Continue'}
                </button>
            </form>
        </div>
    );
};

export default Forget;
