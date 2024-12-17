import React from 'react';
import PropTypes from 'prop-types';
import { MdOutlineLocationOn } from "react-icons/md";
import { MdOutlineStars, MdOutlineAccessTime } from 'react-icons/md';
import { RiMoneyRupeeCircleLine } from 'react-icons/ri';

const Container = ({ img, title, time, delivery, rating, cuisine, location, onClick }) => {
  return (
    <div 
      className="flex flex-col md:flex-row items-center shadow-lg rounded-lg w-full md:h-52 max-w-2xl cursor-pointer bg-white hover:shadow-2xl transition-all transform hover:scale-105 duration-300 ease-out"
      onClick={onClick} // Attach onClick directly here
    >
      {/* Left-side image */}
      <div className="w-full h-[160px] md:h-full rounded-lg overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-300"
        />
      </div>

      {/* Right-side content */}
      <div className="w-full flex flex-col justify-between p-4 text-[#282828]">
        {/* Title */}
        <p className="text-lg md:text-2xl font-semibold">{title}</p>

        {/* Time and Delivery */}
        <div className="flex justify-between items-center text-sm md:text-base mt-2 text-gray-600">
          <div className="flex items-center">
            <MdOutlineAccessTime className="mr-2 text-[#ff8c42]" />
            <p>{time} mins</p>
          </div>

          <div className="flex items-center">
            <p>From <span className=' text-[#32cd32] font-bold'>₹{delivery}</span></p>
          </div>
        </div>

        {/* Location and Rating */}
        <div className="flex justify-between items-center text-sm md:text-base mt-2 text-gray-600">
          <div className="flex items-center">
            <MdOutlineLocationOn size={18} className="mr-2 text-[#538ad1]" />
            <p>{location}</p>
          </div>

          <div className="flex items-center">
            <p className='bg-yellow-300 text-white rounded-md p-1 px-2'>{rating}★</p>
          </div>
        </div>

        {/* Cuisine */}
        <p className="text-sm md:text-base mt-2 text-gray-500">{cuisine.join(', ')} </p>
      </div>
    </div>
  );
};

Container.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  delivery: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  cuisine: PropTypes.array.isRequired,
  location: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired 
};

export default Container;
