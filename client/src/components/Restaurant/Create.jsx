import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const Create = () => {
    const cuisineOptions = [
        'Biryani', 'Pizza', 'South-Indian', 'Burgers', 'Chinese',
        'Cakes', 'Shake', 'North-Indian', 'Ice-Cream', 'Pasta',
        'Noodles', 'Rolls', 'Salad', 'Sandwich', 'Desserts'
    ];
    const { id:userId } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        deliveryPrice: '',
        deliveryTime: '',
        cuisines: [],
        image: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCuisineChange = (cuisine) => {
        setFormData(prevState => ({
            ...prevState,
            cuisines: prevState.cuisines.includes(cuisine)
                ? prevState.cuisines.filter(c => c !== cuisine)
                : [...prevState.cuisines, cuisine]
        }));
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'cuisines') {
                data.append(key, JSON.stringify(value));
            } else {
                data.append(key, value);
            }
        });
        setIsLoading(true); 
        try {
            const response = await axios.post(`http://localhost:4000/api/restaurant/new/${userId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            toast.success(response.data.message);
            setIsLoading(false);
            navigate('/restaurant/signin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
            setIsLoading(false); 
        }
    };

    return (
        <div className="max-w-2xl my-8 mx-auto p-5 rounded-lg shadow-lg bg-white">
            <h1 className="text-2xl font-bold text-center mb-8">Restaurant Details</h1>

            <form onSubmit={handleSubmit}>
                {/* <div className="mb-6">
                    <label className="block mb-2">Name</label>
                    <input
                        className="profileInput"
                        type="text"
                        name="name"
                        placeholder="Restaurant Name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="w-1/2">
                        <label className="block mb-2">Email</label>
                        <input
                            className="profileInput"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-2">Contact</label>
                        <input
                            className="profileInput"
                            type="text"
                            name="contact"
                            placeholder="Contact Number"
                            value={formData.contact}
                            onChange={handleInputChange}
                        />
                    </div>
                </div> */}

                <h2 className="text-lg font-semibold mb-4">Address</h2>
                <div className="mb-6">
                    <label className="block mb-2">Street Address</label>
                    <input
                        className="profileInput"
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex gap-4 mb-6">
                    <div className="w-1/2">
                        <label className="block mb-2">City</label>
                        <input
                            className="profileInput"
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-2">State</label>
                        <input
                            className="profileInput"
                            type="text"
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-2">Cuisines</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {cuisineOptions.map((cuisine, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={cuisine}
                                    checked={formData.cuisines.includes(cuisine)}
                                    onChange={() => handleCuisineChange(cuisine)}
                                    className="mr-2"
                                />
                                <label htmlFor={cuisine} className="text-sm">{cuisine}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="w-1/2">
                        <label className="block mb-2">Delivery Price</label>
                        <input
                            className="profileInput"
                            type="number"
                            name="deliveryPrice"
                            placeholder="Price"
                            value={formData.deliveryPrice}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-2">Delivery Time</label>
                        <input
                            className="profileInput"
                            type="number"
                            name="deliveryTime"
                            placeholder="Estimated Delivery Time"
                            value={formData.deliveryTime}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-2">Item Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <button className='button w-full justify-center items-center' type='submit' disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Restaurant'}
                </button>
            </form>
        </div>
    );
};

export default Create;
