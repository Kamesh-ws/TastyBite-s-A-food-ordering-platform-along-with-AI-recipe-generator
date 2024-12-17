import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from './Container';
import img1 from '../../../assets/menu_9.jpg';
import img2 from '../../../assets/food_1.png';

const Restarant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  const getAllRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/restaurants");
      console.log("API Response: ", res.data); // Log response here
      setRestaurants(res.data.restaurants);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    getAllRestaurants();
  }, []);

  const handleNavigate = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className='flex-col mx-2 md:mx-24 mt-5'>
      <div className='text-2xl font-semibold'>
        <h1>Top Restaurant</h1>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 py-4 gap-6 md:gap-8 justify-items-center'>

        {Array.isArray(restaurants) && restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <Container
              key={restaurant._id}
              img={restaurant.image}
              title={restaurant.name}
              time={restaurant.estimatedDeliveryTime}
              delivery={restaurant.deliveryPrice}
              rating={restaurant.rating}
              cuisine={restaurant.cuisines}
              location={restaurant.address.city}
              onClick={() => handleNavigate(restaurant._id)}
            />
          ))
        ) : (
          <div>No restaurant items available</div>
        )}

      </div>
    </div>
  );
};

export default Restarant;
