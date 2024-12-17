import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MenuItem from './Restaurant/MenuItem';
import { useNavigate, useParams } from 'react-router-dom';
import Cuisine from './Cuisine'

const Category = () => {

  const { cuisine } = useParams();

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate= useNavigate();

  const getMenus = async () => {
    try {
      setLoading(true);
      setErrorMessage(''); // Reset error message
      const url = cuisine ? `http://localhost:4000/api/menus/cuisine/${cuisine}` : 'http://localhost:1300/api/menus';
      const res = await axios.get(url);

      if (!res.data.success) {
        setErrorMessage(res.data.message); // Show error message if `success` is false
      } else {
        setMenus(res.data.menus);
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to fetch menus. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMenus();
  }, [cuisine]);

  const handleNavigate = (menuId) => {
    navigate(`/menu/${menuId}`);
  };

  return (
    <div className='flex-col'>
      <Cuisine />
      {/* Display menus based on selected cuisine or all menus */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 py-4 mx-2 md:mx-24 mt-8'>
        {loading ? (
          <div>Loading...</div>
        ) : errorMessage ? (
          <div>{errorMessage}</div> // Display error message
        ) : Array.isArray(menus) && menus.length > 0 ? (
          menus.map((menu) => (
            <MenuItem
              key={menu._id}
              name={menu.name}
              price={menu.price}
              description={menu.description}
              rating={menu.ratings}
              img={menu.image}
              isVeg={menu.foodTag === 'Veg'}
              start={menu.startHour}
              end={menu.endHour}
              offerPrice={menu.offer}
              onClick={() => handleNavigate(menu._id)}
            />
          ))
        ) : (
          <div>No menu items available</div>
        )}
      </div>
    </div>
  )
}

export default Category