import React, { useState } from 'react';
import { MdLocationPin, MdMyLocation } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchBox = () => {
  const [location, setLocation] = useState('');
  const [searchName, setSearchName] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Detect current location using GPS
  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

          fetch(geocodeUrl)
            .then((response) => response.json())
            .then((data) => {
              if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || "Location not found";
                setLocation(city);
              } else {
                setLocation(`Lat: ${latitude}, Lng: ${longitude}`);
              }
            })
            .catch((error) => {
              console.error("Error fetching address:", error);
              setLocation(`Lat: ${latitude}, Lng: ${longitude}`);
            });

          setUseCurrentLocation(true);
          setDropdownOpen(false); // Close dropdown after fetching location
        },
        (error) => {
          console.error("Error detecting location:", error);
          alert("Unable to detect current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Handle form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!location && !searchName) {
      alert("Please enter a location or search query.");
      return;
    }

    try {
      const response = await axios.get('http://localhost:4000/api/search', { params: { location, searchName } });
      console.log("Search Results:", response.data);

      // Navigate to search results page with results
      navigate(`/search/${searchName}`, { state: { results: response.data.results } });

    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-header-bg bg-center bg-cover bg-no-repeat md:h-[32vw] rounded-md h-[40vw] flex items-center justify-center mx-2 md:mx-24 mt-5">
      <div className="flex items-center gap-2 rounded-xl md:w-full max-w-2xl h-10 w-3/4 md:h-14 p-3 bg-white justify-between relative">
        <div className="flex items-center">
          <MdLocationPin size={30} className='text-[#fc802e]'/>
          <input
            type="text"
            className="focus:outline-none ml-2 bg-transparent w-full"
            name="location"
            placeholder={useCurrentLocation ? "Using Current Location" : "Enter Location"}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={toggleDropdown} className="ml-2">
            {dropdownOpen ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
          </button>
        </div>

        {dropdownOpen && (
          <div className="absolute flex gap-3 left-0 mt-32 md:w-60 p-4 bg-white border rounded shadow-lg z-10">
            <MdMyLocation size={20} className='text-[#fc802e]'/>
            <button
              type="button"
              onClick={detectCurrentLocation}
              className="text-[#fc802e] text-sm"
            >
              Use Current Location
            </button>
          </div>
        )}

        <form className="flex-grow flex items-center" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="focus:outline-none ml-2 bg-transparent w-full"
            name="searchName"
            placeholder="Search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button type="submit" className="ml-2">
            <IoSearch size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;
