import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar, FaEdit, FaTrashAlt } from "react-icons/fa";
import { BiFoodTag } from "react-icons/bi";
import PropTypes from 'prop-types';
import { useCart } from '../CartContext';
import { Link, useNavigate } from 'react-router-dom';
import addIcon from './../../../assets/add_icon_white.png';
import addIconActive from './../../../assets/add_icon_green.png';
import removeIcon from './../../../assets/remove_icon_red.png';

const SpecialItem = ({ img, id, name, price, rating, description, isVeg, offerPrice, onClick, expiryTime  }) => {
    const { addToCart, removeFromCart, cartItems } = useCart();
    const [itemCount, setItemCount] = useState(0);
    const navigate = useNavigate();
    // Function to render star rating
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const expiry = new Date(expiryTime);
            const timeDiff = expiry - now;

            if (timeDiff > 0) {
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                setTimeRemaining(`${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
            } else {
                setTimeRemaining('Expired');
            }
        };

        // Update the timer every second
        const timerInterval = setInterval(updateTimer, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(timerInterval);
    }, [expiryTime]);

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
  
    const handleAddItem = () => {
        setItemCount((prev) => prev + 1);
        addToCart({ id, name, price, img, offerPrice });
      };
    
      const handleRemoveItem = () => {
        if (itemCount > 0) {
          setItemCount((prev) => prev - 1);
          removeFromCart(id);
        }
      };
    
    // Calculate the final price after applying the discount
    const finalPrice = offerPrice ? price - (price * offerPrice / 100) : price;
  
    return (
      <div className="w-full mx-auto rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer" >
        <div className="relative">
          <img
            src={img}
            alt={name}
            className="w-full h-[200px] md:h-[250px] object-cover rounded-t-xl"
          /> {!itemCount ? (
          <img
            className="w-10 absolute bottom-4 right-4 cursor-pointer rounded-full hover:scale-110 transition-transform"
            onClick={handleAddItem}
            src={addIcon}
            alt="Add"
          />
        ) : (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 p-2 rounded-full bg-white shadow-lg">
            <img
              className="w-8 cursor-pointer hover:scale-110 transition-transform"
              onClick={handleRemoveItem}
              src={removeIcon}
              alt="Remove"
            />
            <p className="font-semibold">{itemCount}</p>
            <img
              className="w-8 cursor-pointer hover:scale-110 transition-transform"
              onClick={handleAddItem}
              src={addIconActive}
              alt="Add"
            />
          </div>
        )}
        </div>
        <div className="p-5 bg-white rounded-b-xl " onClick={onClick}>
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
          <div className='mt-2'>
            {timeRemaining !== 'Expired' ? (
                <span style={{ color: 'green' }}>Time left: {timeRemaining}</span>
            ) : (
                <span style={{ color: 'red' }}>Expired</span>
            )}
        </div>
         
        </div>
      </div>
    );
  
  };
SpecialItem.propTypes = { 
    img: PropTypes.string.isRequired,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    isVeg: PropTypes.bool.isRequired,
    offerPrice: PropTypes.number, }

export default SpecialItem