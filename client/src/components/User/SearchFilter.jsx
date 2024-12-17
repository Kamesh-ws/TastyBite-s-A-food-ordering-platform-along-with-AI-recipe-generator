import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from './Restaurant/MenuItem';
import Container from './Restaurant/Container';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { BiFoodTag } from "react-icons/bi";
import { useLocation, useNavigate } from 'react-router-dom';

const SearchFilter = () => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    cuisine: '',
    rating: 0,
    foodTag: '',
    offer: false,
    sortBy: 'deliveryTime',
  });
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  const initialResults = location.state?.results || [];
  const initialLocation = location.state?.location || '';
  const initialSearchName = location.state?.searchName || '';
  const [type, setType] = useState('');

  const cuisines = [
    'Biryani', 'Pizza', 'South Indian', 'Burgers', 'Chinese', 'Cakes',
    'Shake', 'North Indian', 'Ice-Cream', 'Pasta', 'Noodles', 'Rolls',
    'Salad', 'Sandwich', 'Desserts',
  ];
  const visibleCuisines = showAllCuisines ? cuisines : cuisines.slice(0, 6);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  useEffect(() => {
    setSearchResults(initialResults);
    setSearchName(initialSearchName);
  }, [initialResults, initialSearchName]);

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      cuisine: '',
      rating: 0,
      foodTag: '',
      offer: false,
      sortBy: 'deliveryTime',
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
  };

  const applyFilters = async () => {
    try {
      const searchParams = {
        location: initialLocation,
        searchName,
        ...filters,
      };
      const response = await axios.get('http://localhost:4000/api/search', {
        params: searchParams,
      });
      setSearchResults(response.data.results || []);
      setType(response.data.type); 
      setError(null);
    } catch (error) {
      console.error('Error fetching filtered search results:', error);
      setError('Could not fetch results. Please try again.');
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!initialLocation && !searchName.trim()) {
      alert('Please enter a location or search query.');
      return;
    }
    try {
      const response = await axios.get('http://localhost:4000/api/search', {
        params: { location: initialLocation, searchName: searchName.trim() },
      });
      setSearchResults(response.data.results || []);
      setType(response.data.type); 
      setError(null);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Could not fetch results. Please try again.');
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const renderStars = () => {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => handleFilterChange('rating', i + 1)}
        className="p-1"
        aria-label={`Filter by ${i + 1} stars`}
      >
        {i + 1 <= filters.rating ? (
          <FaStar className="text-yellow-500" size={20} />
        ) : (
          <FaRegStar className="text-yellow-500" size={20} />
        )}
      </button>
    ));
  };

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
      {/* Filter Section */}
      <div className="w-full lg:w-1/4 p-4 rounded-md shadow-xl">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-semibold mb-6 items-center">Filters</h3>
          <button
            onClick={clearAllFilters}
            className="border border-red-500 text-red-500 items-center px-3 py-1 rounded-full"
          >
            Clear All
          </button>
        </div>
        {/* Rating */}
        <div className="mb-4 flex items-center">
          <label className="block font-semibold mb-2">Rating</label>
          <div className="flex ml-4">{renderStars()}</div>
        </div>
        {/* Food Type */}
        <div className="mb-4 flex items-center">
          <label className="block font-semibold mb-2">Food Type</label>
          <div className='flex ml-4'>
            <label className="mr-4 flex">
              <input
                type="radio"
                name="foodType"
                value="Veg"
                checked={filters.foodTag === 'Veg'}
                onChange={() => handleFilterChange('foodTag', 'Veg')}
              />
              <BiFoodTag size={25} className="ml-1 text-green-600"/>
            </label>
            <label className='flex'>
              <input
                type="radio"
                name="foodType"
                value="Non-Veg"
                checked={filters.foodTag === 'Non-Veg'}
                onChange={() => handleFilterChange('foodTag', 'Non-Veg')}
              />
              <BiFoodTag size={25} className="ml-1 text-red-600"/>
            </label>
          </div>
        </div>
        {/* Cuisine */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Cuisine</label>
          <ul>
            {visibleCuisines.map((cuisine, index) => (
              <li key={index} className="mb-1">
                <button
                  className={`px-2 py-1 border rounded-full w-full ${
                    filters.cuisine === cuisine ? 'bg-orange-500 text-white' : 'bg-white'
                  }`}
                  onClick={() => handleFilterChange('cuisine', cuisine)}
                >
                  {cuisine}
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-2 text-orange-500"
            onClick={() => setShowAllCuisines((prev) => !prev)}
          >
            {showAllCuisines ? 'View Less' : 'View More'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col items-center mb-6">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
            <input
              type="text"
              placeholder="Search"
              className="p-2 border border-gray-300 rounded-md w-full"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 ml-2 rounded-md"
            >
              Search
            </button>
          </form>
          <div className="flex items-center mt-3 justify-end gap-4 w-full">
            <select
              className="p-2 border border-gray-300 rounded-md"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="deliveryTime">Sort by Delivery Time</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="offer">Sort by Offers</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : searchResults.length ? (
            searchResults.map((item, index) => (
              <div key={index} className="p-3">
                {type === 'restaurant' ? (
                  <Container
                    key={item._id}
                    img={item.image}
                    title={item.name}
                    time={item.estimatedDeliveryTime}
                    delivery={item.deliveryPrice}
                    rating={item.rating}
                    cuisine={item.cuisines}
                    location={item.address.city}
                    onClick={() => handleNavigate(`/restaurant/${item._id}`)}
                  />
                ) : (
                  <MenuItem
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    description={item.description}
                    rating={item.ratings}
                    img={item.image}
                    isVeg={item.foodTag === 'Veg'}
                    start={item.startHour}
                    end={item.endHour}
                    offerPrice={item.offer}
                    onClick={() => handleNavigate(`/menu/${item._id}`)}
                  />
                )}
              </div>
            ))
          ) : (
            <p>No results found for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
