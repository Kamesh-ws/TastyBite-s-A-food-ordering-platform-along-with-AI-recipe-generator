import React, { useState } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar, FaEdit, FaTrashAlt } from "react-icons/fa";
import { BiFoodTag } from "react-icons/bi";
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

const RMenuItem = ({ img, id, name, price, rating, description, isVeg, offerPrice, onClick }) => {

  const navigate = useNavigate();
  // Function to render star rating
  const renderStars = () => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const starsArray = [];

    for (let i = 0; i < filledStars; i++) {
      starsArray.push(<FaStar key={i} className="text-yellow-500" />);
    }

    for (let i = filledStars; i < totalStars; i++) {
      starsArray.push(<FaRegStar key={i} className="text-yellow-500" />);
    }

    return starsArray;
  };

  const deleteHandler = async (e, id) => {
    e.preventDefault();

    // Confirmation popup
    const confirmDelete = window.confirm("Are you sure you want to delete this menu item?");
    
    if (confirmDelete) {
        try {
          const token = localStorage.getItem('token');
            // Send delete request to the backend
            await axios.delete(`http://localhost:4000/api/restaurant/menu/${id}`, {
              headers: {
                   token: `${token}`  // Send token in the Authorization header
              }
          });
            console.log("Menu item deleted successfully.");
            navigate("/restaurant");
        } catch (error) {
            console.error("Error deleting the menu item:", error);
        }
    } else {
        console.log("Deletion canceled.");
    }
};


  // Calculate the final price after applying the discount
  const finalPrice = offerPrice ? price - (price * offerPrice / 100) : price;

  return (
    <div className="w-full mx-auto rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img
          src={img}
          alt={name}
          className="w-full h-[200px] md:h-[250px] object-cover rounded-t-xl"
        />
      </div>
      <div className="p-5 bg-white rounded-b-xl">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg md:text-xl font-semibold text-gray-800  truncate">{name}</p>
          <div className="flex items-center">
            <div className="flex">
              {renderStars()}
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm md:text-base mb-2 truncate">{description}</p>
        <div className='flex items-center justify-between'>
          <div className="flex items-center">
            <BiFoodTag className={`text-2xl ${isVeg ? 'text-green-500' : 'text-red-500'}`} />
            <p className={`ml-2 text-sm ${isVeg ? 'text-green-500' : 'text-red-500'}`}>
              {isVeg ? 'Veg' : 'Non-Veg'}
            </p>
          </div>
          <div className="text-right flex items-center gap-2 ">
            {offerPrice ? (
              <>
                <p className="text-gray-400 line-through">₹{price}</p>
                <p className="text-primary text-xl font-semibold">₹{finalPrice.toFixed(2)}</p>
              </>
            ) : (
              <p className="text-primary text-xl font-semibold">₹{price}</p>
            )}
          </div>

        </div>
        <div className='flex gap-5 justify-center items-center mt-2'>
          <Link to={`http://localhost:3000/restaurant/menu/${id}`} className='flex items-center gap-2 p-2  w-[6.8rem] bg-primary text-white rounded-md hover:scale-110 duration-300 justify-center'><FaEdit /> Update
          </Link>
          <button
            className='flex items-center gap-2 p-2 w-[6.8rem] bg-primary text-white rounded-md hover:scale-110 duration-300 justify-center'
            onClick={e => deleteHandler(e, id)} >
            <FaTrashAlt /> Delete
          </button>
        </div>
      </div>
    </div>
  );

};

RMenuItem.propTypes = {
  img: PropTypes.string.isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  isVeg: PropTypes.bool.isRequired,
  offerPrice: PropTypes.number, // New prop to represent the discount percentage
};

export default RMenuItem;
