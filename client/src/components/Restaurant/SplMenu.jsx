import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuItem from './SMenuItem';
import { Link, useNavigate } from 'react-router-dom';


const SplMenu = () => {
    const [menus, setMenus] = useState([]);
    const navigate = useNavigate();

    const getAllMenus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get("http://localhost:4000/api/special-dishes", {
                headers: {
                    token: `${token}`,
                },
            });
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
                <Link
                    to="/restaurant/special/new"
                    className="flex items-center justify-center gap-2 w-10 h-10 text-3xl bg-primary text-white rounded-full hover:scale-110 duration-300"
                >
                    +
                </Link>
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

export default SplMenu