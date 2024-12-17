import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../CartContext';
import { MdOutlineLocationOn } from "react-icons/md";
import { MdOutlineStars, MdOutlineAccessTime } from 'react-icons/md';
import { RiMoneyRupeeCircleLine } from 'react-icons/ri';
import addIcon from '../../../assets/add_icon_white.png';
import addIconActive from '../../../assets/add_icon_green.png';
import removeIcon from '../../../assets/remove_icon_red.png';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, cartItems } = useCart();
  const [itemCounts, setItemCounts] = useState({});

  useEffect(() => {
    // Initialize itemCounts from cartItems
    const counts = {};
    cartItems.forEach(item => {
      counts[item.id] = item.quantity || 0;
    });
    setItemCounts(counts);
  }, [cartItems]);

  const handleAddItem = (item) => {
    setItemCounts((prev) => ({
      ...prev,
      [item._id]: (prev[item._id] || 0) + 1,
    }));
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      img: item.image,
      offerPrice: item.offerPrice,
    });
  };

  const handleRemoveItem = (item) => {
    if (itemCounts[item._id] > 0) {
      setItemCounts((prev) => ({
        ...prev,
        [item._id]: prev[item._id] - 1,
      }));
      removeFromCart(item._id);
    }
  };

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/restaurant/${id}`);
        const restaurantData = res.data.restaurant;
        setRestaurant(restaurantData);

        if (restaurantData.menu && restaurantData.menu.length > 0) {
          const menuResponses = await Promise.all(
            restaurantData.menu.map(menuId =>
              axios.get(`http://localhost:4000/api/restaurant/menu/${menuId}`)
            )
          );
          const menuData = menuResponses.map(res => res.data.menu);
          setMenuItems(menuData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div className="mx-2 md:mx-24 my-8 p-4 md:p-8 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 md:h-80 object-cover rounded-lg"
        />
        <h1 className="text-3xl font-bold my-4">{restaurant.name}</h1>
        <div className="flex items-center text-gray-600 text-sm md:text-base">
          <MdOutlineStars className="mr-1 text-yellow-500" />
          <span className="mr-4">{restaurant.rating} Stars</span>
          <RiMoneyRupeeCircleLine className="mr-1 text-green-500" />
          <span>From ₹{restaurant.deliveryPrice}</span>
        </div>
        {/* <p className="text-gray-600 mt-2">{restaurant.address}</p> */}
        <p className="text-gray-500 mt-1">Cuisine: {restaurant.cuisines.join(', ')}</p>
      </div>

      {/* Menu Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  {!itemCounts[item._id] ? (
                    <img
                      className="w-10 absolute bottom-4 right-4 cursor-pointer rounded-full hover:scale-110 transition-transform"
                      onClick={() => handleAddItem(item)}
                      src={addIcon}
                      alt="Add"
                    />
                  ) : (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 p-2 rounded-full bg-white shadow-lg">
                      <img
                        className="w-8 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleRemoveItem(item)}
                        src={removeIcon}
                        alt="Remove"
                      />
                      <p className="font-semibold">{itemCounts[item._id]}</p>
                      <img
                        className="w-8 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleAddItem(item)}
                        src={addIconActive}
                        alt="Add"
                      />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                <div className="flex justify-between items-center text-gray-600 text-sm mt-2">
                  <span className=' text-green-500 text-xl font-bold'>₹{item.price}</span>
                  <span className=' bg-yellow-300 text-white rounded-md p-1 px-2'>{item.ratings} ★</span>
                </div>
              </div>
            ))
          ) : (
            <p>No menu items available</p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="text-gray-600 mt-2">{restaurant.description}</p>
        <div className='flex items-center'>
        <div className="flex items-center mt-4 text-gray-600">
          <MdOutlineAccessTime className="mr-1 text-orange-500" />
          <span>{restaurant.estimatedDeliveryTime} mins delivery time</span>
        </div>
        <div className="flex items-center mt-4 text-gray-600 ml-5">
          <MdOutlineLocationOn className="mr-1 text-orange-500" />
          <span>
            {restaurant.address.address}, {restaurant.address.city}, {restaurant.address.state}
            </span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
