import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuItem from './Restaurant/SpecialItem';
import { Link, useNavigate } from 'react-router-dom';


const Special = () => {
    const [menus, setMenus] = useState([]);
    const navigate = useNavigate();

    const getAllMenus = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/special");
            setMenus(res.data.specialDishes);

        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    useEffect(() => {
        getAllMenus();
    }, []);

    const handleNavigate = (menuId) => {
        navigate(`/restaurant/splmenudetail/${menuId}`);
    };

    return (
        <div className='flex flex-col mx-4 md:mx-24 mt-5'>
            <div className='flex text-2xl font-semibold items-center justify-between'>
                <h1>Special Dish</h1>
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
                            expiryTime={menu.specialDishExpiry}
                        />
                    ))
                ) : (
                    <div>No menu items available</div>
                )}
            </div>
        </div>
    )
}

export default Special