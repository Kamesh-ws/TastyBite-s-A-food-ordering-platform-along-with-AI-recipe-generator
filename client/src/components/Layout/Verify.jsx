import React, { useState, useRef } from 'react';
import { GiChickenLeg } from "react-icons/gi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verify = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState("");
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    // Handle change in input
    const handleChange = (element, index) => {
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move to the next input box automatically
        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle backspace for deletion
    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const entered = otp.join('');
        if (entered.length !== 6) {
            toast.error("Please enter the full OTP");
            return;
        }

        const enteredOtp = Number(entered);
        const token = localStorage.getItem('jwtToken');
    
        try {
            const response = await axios.post("http://localhost:4000/api/signup/verify", {
                enteredOtp, 
                token
            });

            if (response.data.role === "user") {
                toast.success("User verification successful!");
                navigate("/signin");
            } else if (response.data.role === "restaurant") {
                toast.success("Restaurant verification successful!");
                navigate(`/restaurnt/new/${response.data.userId}`);
            } else {
                toast.error("Invalid role received from server.");
            }
        } catch (error) {
            const message = error.response?.data?.message || "An error occurred. Please try again.";
            toast.error(message);
        }
    };

    return (
        <div className='flex items-center p-2 justify-center mt-10'>
            <form className='form-container relative' onSubmit={handleSubmit}>
                <div className='flex items-center justify-center gap-1'>
                    <span><GiChickenLeg size={30} className='text-primary' /></span>
                    <h1 className='logo'>Tasty Bites</h1>
                </div>

                <h1 className='text-center'>OTP Verify</h1>

                <div className='flex gap-4 w-full justify-center'>
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            className='otpInput text-center'
                            type='text'
                            maxLength={1}
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleBackspace(e, index)}
                            inputMode='numeric'
                        />
                    ))}
                </div>

                <button type='submit' className='button mt-4'>Verify</button>
            </form>

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Verify;
