import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate to programmatically navigate
import Glogo from '../../assets/google.png'; // Google logo image
import { GiChickenLeg } from "react-icons/gi"; // Chicken leg icon for branding
import { IoClose } from "react-icons/io5"; // Close icon for modal closing

const Rlogin = () => {
  const [isVisible, setIsVisible] = useState(true); // Control visibility of the login form
  const [email, setEmail] = useState(''); // Email state
  const [password, setPassword] = useState(''); // Password state
  const [errorMessage, setErrorMessage] = useState(''); // To store any error messages
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to close the form
  const handleClose = () => {
    setIsVisible(false);
  };

  // Handle login and store token and user data
  const handleLogin = (response) => {
    const { token } = response.data;// assuming the API returns these fields
    localStorage.setItem('token', token); // Store token in localStorage
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });
  
      // Destructure the required fields from the response
      const { message, token, name, role } = response.data;
  
      // Store the token, name, and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', message);  // Store the welcome message
      localStorage.setItem('name', name);     // Store the user's name
      localStorage.setItem('role', role);     // Store the user's role (e.g. 'restaurant')
     
      const isRestaurant = role === 'restaurant';
      // Redirect to the homepage after login
      {isRestaurant?(
        navigate('/restaurant')
      ):(
        navigate('/')
      )}
      
    } catch (error) {
      // Handle error and display a message
      setErrorMessage('Login failed. Please check your credentials and try again.');
      console.error(error);
    }
  };
  

  if (!isVisible) return null; // Don't render the form if not visible

  return (
    <div className='flex items-center p-2 justify-center mt-10'>
      <form className='form-container relative'>
        <Link to='/'><IoClose
          size={25}
          className='text-gray-500 cursor-pointer absolute top-7 right-4'
          onClick={handleClose}
        /></Link>
        <div className='flex items-center justify-center gap-1'>
          <span><GiChickenLeg size={30} className='text-primary' /></span>
          <h1 className='logo'>Tasty Bites</h1>
        </div>

        <h1 className='text-center'>Welcome back! Sign in with</h1>

        {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>} {/* Error message display */}

        {/* Email Input */}
        <input
          className='inputBox'
          type='email'
          name='email'
          id='email'
          value={email}
          placeholder='email id'
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <div className='flex flex-col gap-2 w-full'>
          <input
            className='inputBox'
            type='password'
            name='password'
            id='password'
            value={password}
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/password/forgot" className="text-xs text-left text-primary">Forgot Password?</Link>
        </div>

        {/* Sign In Button */}
        <button className='button' onClick={handleSubmit}>Sign in</button>

        {/* Sign Up Link */}
        <span className='text-xs'>
          New here? <Link to='/restaurant/signup' className='text-primary'>Create an account</Link>
        </span>

        {/* Google Sign In Button
        <Link to='/home' className='button flex items-center justify-center gap-2'>
          <img src={Glogo} alt='Google logo' className='w-5' /> Google
        </Link> */}
      </form>
    </div>
  );
};

export default Rlogin;
