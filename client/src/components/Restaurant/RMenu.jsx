import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuItem from './RMenuItem';
import { Link, useNavigate } from 'react-router-dom';

const RMenu = () => {
    const [menus, setMenus] = useState([]);
    const navigate= useNavigate();

    const getAllMenus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get("http://localhost:4000/api/restaurant/menus", {
                headers: {
                    token: `${token}`,
                },});
            setMenus(res.data); 
            
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    useEffect(() => {
        getAllMenus();
    }, []);

    const handleNavigate = (menuId) => {
        navigate(`/restaurant/menudetail/${menuId}`);
      };

    return (
        <div className='flex flex-col mx-4 md:mx-24 mt-5'>
            <div className='flex text-2xl font-semibold justify-between'>
                <h1>Menus</h1>
                {/* <Link to='/restaurant/menu/new'
            className='flex items-center gap-2 p-2 bg-primary text-white rounded-md hover:scale-110 duration-300 justify-center'
            >Add button
          </Link> */}
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
                            offerPrice={menu.offer}
                            onClick={() => handleNavigate(menu._id)}
                        />
                    ))
                ) : (
                    <div>No menu items available</div>
                )}
            </div>
        </div>
    );
};

export default RMenu;
