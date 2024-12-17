import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate, useParams } from 'react-router-dom';

const MenuUpdate = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [shour, setSHour] = useState('');
    const [ehour, setEHour] = useState('');
    const [offer, setOffer] = useState('');
    const [description, setDescription] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [foodTag, setFoodTag] = useState('Veg'); // Default to Veg
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const { id: menuId } = useParams(); // Access menu ID from the route params

    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Fetch token from localStorage
    const handleClose = () => {
        setIsVisible(false);
    };

    // Fetch menu data from API using menuId
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/restaurant/menu/${menuId}`, {
                    headers: {
                        token: `${token}` // Include Authorization header
                    }
                });

                console.log('API Response:', response.data); // Debugging log

                const menu = response.data.menu; // Assuming the response contains a "menu" object

                // Set state with the fetched menu data
                setName(menu.name);
                setPrice(menu.price);
                setSHour(menu.startHour);
                setEHour(menu.endHour);
                setOffer(menu.offer);
                setDescription(menu.description);
                setCuisineType(menu.cuisineType);
                setFoodTag(menu.foodTag);
                setQuantity(menu.quantity);
                setImage(menu.image); // You might want to handle image differently
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };
        fetchMenu();
    }, [menuId, token]); // Ensure the effect runs when menuId or token changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('startHour', shour);
            formData.append('endHour', ehour);
            formData.append('description', description);
            formData.append('cuisineType', cuisineType);
            formData.append('foodTag', foodTag);
            formData.append('quantity', quantity);
            formData.append('offer', offer);
            if (image) {
                formData.append('image', image);
            }
            const response = await axios.put(`http://localhost:4000/api/restaurant/menu/${menuId}`, formData, {
                headers: {
                    token: `${token}`, // Include Authorization header
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Navigate to another page or display a success message
            navigate('/restaurant');
        } catch (error) {
            console.log(error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className='flex items-center p-2 justify-center mt-10'>
            <form className='form-container relative' onSubmit={handleSubmit}>
                <Link to='/restaurant'><IoClose
                    size={25}
                    className='text-gray-500 cursor-pointer absolute top-7 right-4'
                    onClick={handleClose}
                /></Link>
                <h1 className='logo'>Update Menu Item</h1>
                <div className='md:flex md:flex-row flex-col gap-3 w-full items-center'>
                    <div className='flex-col'>
                        <p>Name</p>
                        <input
                            className='inputBox'
                            type='text'
                            value={name}
                            placeholder='Menu Name'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='flex-col'>
                        <p>Price</p>
                        <input
                            className='inputBox'
                            type='number'
                            value={price}
                            placeholder='Price'
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>
                <div className='md:flex md:flex-row flex-col gap-3 w-full items-center'>
                    <div className='flex-col'>
                        <p>Start hour</p>
                        <input
                            className='inputBox'
                            type='number'
                            value={shour}
                            placeholder='Start hour'
                            onChange={(e) => setSHour(e.target.value)}
                        />
                    </div>
                    <div className='flex-col'>
                        <p>End hour</p>
                        <input
                            className='inputBox'
                            type='number'
                            value={ehour}
                            placeholder='End hour'
                            onChange={(e) => setEHour(e.target.value)}
                        />
                    </div>
                </div>

                <div className='flex-col w-full items-center'>
                    <p>Description</p>
                    <textarea
                        className='md:p-2 p-1 w-full border-[1px] border-gray-200 rounded-md text-base outline-none'
                        style={{ height: '100px' }} // Make textarea fit container height
                        value={description}
                        placeholder='Description'
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className='md:flex md:flex-row gap-3 w-full items-center'>
                    <div className='flex-col'>
                        <p>Cuisine Type</p>
                        <select
                            className='inputBox'
                            value={cuisineType}
                            onChange={(e) => setCuisineType(e.target.value)}
                        >
                            <option value="">Select Cuisine</option>
                            {['Biryani', 'Pizza', 'South-Indian', 'Burgers', 'Chinese', 'Cakes', 'Shake', 'North-Indian', 'Ice-Cream', 'Pasta', 'Noodles', 'Rolls', 'Salad', 'Sandwich', 'Deserts'].map((cuisine, index) => (
                                <option key={index} value={cuisine}>
                                    {cuisine}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex-col w-full'>
                        <p>Food Tag</p>
                        <div className='flex gap-2'>
                            <label>
                                <input
                                    type='radio'
                                    value='Veg'
                                    checked={foodTag === 'Veg'}
                                    onChange={(e) => setFoodTag(e.target.value)}
                                /> Veg
                            </label>
                            <label>
                                <input
                                    type='radio'
                                    value='Non-Veg'
                                    checked={foodTag === 'Non-Veg'}
                                    onChange={(e) => setFoodTag(e.target.value)}
                                /> Non-Veg
                            </label>
                        </div>
                    </div>
                </div>

                <div className='md:flex md:flex-row gap-3 w-full items-center'>
                    <div className='flex-col'>
                        <p>Offer %</p>
                        <input
                            className='inputBox'
                            type='number'
                            value={offer}
                            placeholder='Offer'
                            onChange={(e) => setOffer(e.target.value)}
                        />
                    </div>

                    <div className='flex-col'>
                        <p>Quantity</p>
                        <input
                            className='inputBox'
                            type='number'
                            value={quantity}
                            placeholder='Quantity'
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                </div>
                <div className='flex-col w-full'>
                    <p>Item Image</p>
                    <input
                        type='file'
                        className='border w-full border-gray-200 p-2 rounded-md'
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button className='button' type='submit'>Update Menu</button>
            </form>
        </div>
    );
};

export default MenuUpdate;
