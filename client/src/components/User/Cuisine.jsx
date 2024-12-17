import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import menu_9 from "../../assets/menu_1.png";
import menu_2 from "../../assets/menu_2.png";
import menu_3 from "../../assets/menu_3.png";
import menu_4 from "../../assets/menu_4.png";
import menu_5 from "../../assets/menu_5.png";
import menu_6 from "../../assets/menu_6.png";
import menu_7 from "../../assets/menu_7.png";
import menu_8 from "../../assets/menu_8.png";
import menu_1 from "../../assets/menu_9.jpg";
import menu_10 from "../../assets/menu_10.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const menu_list = [
  { menu_name: "Biryani", menu_image: menu_1 },
  { menu_name: "Rolls", menu_image: menu_2 },
  { menu_name: "Deserts", menu_image: menu_3 },
  { menu_name: "Sandwich", menu_image: menu_4 },
  { menu_name: "Cakes", menu_image: menu_5 },
  { menu_name: "South-Indian", menu_image: menu_6 },
  { menu_name: "North-Indian", menu_image: menu_10 },
  { menu_name: "Pasta", menu_image: menu_7 },
  { menu_name: "Noodles", menu_image: menu_8 },
  { menu_name: "Salad", menu_image: menu_9 },
];

const Cuisine = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate(); // Hook to navigate

  // Function to scroll left
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  // Function to scroll right
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // Handle cuisine click and navigate
  const handleCuisineClick = (cuisineName) => {
    navigate(`/cuisine/${cuisineName}`); // Navigate to the cuisine page
  };

  return (
    <div className="flex-col mx-2 md:mx-24 mt-8">
      {/* Heading and scroll buttons */}
      <div className='flex justify-between px-1'>
        <div className='text-2xl font-semibold text-gray-800'>
          <h1>Popular Cuisines</h1>
        </div>
        <div className="flex gap-2">
          <FaChevronLeft
            onClick={scrollLeft}
            className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition-all shadow-md"
            size={30}
          />
          <FaChevronRight
            onClick={scrollRight}
            className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition-all shadow-md"
            size={30}
          />
        </div>
      </div>

      {/* Scrollable menu container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-5 overflow-x-auto whitespace-nowrap py-6 scrollbar-hide"
      >
        {menu_list.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCuisineClick(item.menu_name)} // Navigate on click
            className="flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-105"
          >
            {/* Circular image with active state */}
            <div
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-lg transition-all duration-300 border-transparent`}
            >
              <img src={item.menu_image} alt={item.menu_name} className="w-full h-full object-cover" />
            </div>
            <p className="mt-3 text-center text-lg text-gray-700">
              {item.menu_name}
            </p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Cuisine;
