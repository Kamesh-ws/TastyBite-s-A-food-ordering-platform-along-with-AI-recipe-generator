import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import MenuItem from './Restaurant/MenuItem';
import { useNavigate } from 'react-router-dom';

const Offer = () => {
  const [menus, setMenus] = useState([]);
  const navigate= useNavigate();

  const getAllMenus = async () => {
      try {
          const res = await axios.get("http://localhost:4000/api/menus/offers");
          console.log("API Response: ", res.data); // Log response here
          setMenus(res.data.menusWithOffers);
      } catch (error) {
          console.error("Error fetching menus:", error);
      }
  };

  useEffect(() => {
      getAllMenus();
  }, []);

  const handleNavigate = (menuId) => {
    navigate(`/menu/${menuId}`);
  };

  return (
    <div className='flex flex-col mx-4 md:mx-24 mt-5'>
    <div className='text-2xl font-semibold'>
        <h1>Best Offer's</h1>
    </div>
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 py-4 '>
                {Array.isArray(menus) && menus.length > 0 ? (
                    menus.map((menu) => (
                        <MenuItem
                            key={menu._id}
                            id={menu._id}
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

export default Offer