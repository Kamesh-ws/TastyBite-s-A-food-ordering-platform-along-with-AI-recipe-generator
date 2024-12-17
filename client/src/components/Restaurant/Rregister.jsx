import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Glogo from '../../assets/google.png';
import { GiChickenLeg } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

const Rregister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phno, setPhno] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/signup", {
        username, 
        email, 
        password,
        phoneNo: phno,
        role: "restaurant"
      });
      
      const { message, token } = response.data;
      localStorage.setItem('jwtToken', token);

      // Display success toast
      toast.success(message || "Account created successfully!");

      // Navigate to the verify page after successful registration
      setTimeout(() => navigate("/verify"), 2000); // Add delay to show toast before navigating

    } catch (error) {
      console.error(error);
      
      // Display error toast
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during registration. Please try again.");
      }
    }
  };

  if (!isVisible) return null; // Don't render the form if not visible

  return (
    <div className='flex items-center p-2 justify-center mt-10'>
      <ToastContainer position="top-right" autoClose={3000} /> {/* Add ToastContainer */}
      <form className='form-container relative'>
        <Link to='/'>
          <IoClose
            size={25}
            className='text-gray-500 cursor-pointer absolute top-7 right-4'
            onClick={handleClose}
          />
        </Link>
        <div className='flex items-center gap-1'>
          <span><GiChickenLeg size={30} className='text-primary' /></span>
          <h1 className='logo'>Tasty Bites</h1>
        </div>
        <h1 className='text-center'>Create an account</h1>
        <input
          className='inputBox'
          type='text'
          name='username'
          id='username'
          value={username}
          placeholder='username'
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className='inputBox'
          type='number'
          name='PhoneNo'
          id='PhoneNo'
          value={phno}
          placeholder='Contact No'
          onChange={(e) => setPhno(e.target.value)}
        />
        <input
          className='inputBox'
          type='email'
          name='email'
          id='email'
          value={email}
          placeholder='email id'
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='inputBox'
          type='password'
          name='password'
          id='password'
          value={password}
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='flex items-start gap-2 p-2 sm:w-[20rem] w-full text-base outline-none'>
          <input type="checkbox" required className='mt-1 text-primary' />
          <span className='text-xs'>By continuing, I agree to the terms of use & privacy policy.</span>
        </div>
        <button className='button' onClick={handleSubmit}>Sign up</button>
        <span className='text-xs'>
          Already have an account? <Link to='restaurant/signin' className='text-primary'>Sign in</Link>
        </span>
        {/* <Link to='/home' className='button flex items-center justify-center gap-2'>
          <img src={Glogo} alt='Google' className='size-5' /> Google
        </Link> */}
      </form>
    </div>
  );
};

export default Rregister;
