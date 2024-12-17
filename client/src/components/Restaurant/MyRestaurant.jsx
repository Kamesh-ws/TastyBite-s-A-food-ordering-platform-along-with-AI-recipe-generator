// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const MyRestaurant = () => {
//     const cuisineOptions = [
//         'Biryani', 'Pizza', 'South Indian', 'Burgers', 'Chinese',
//         'Cakes', 'Shake', 'North Indian', 'Ice-Cream', 'Pasta',
//         'Noodles', 'Rolls', 'Salad', 'Sandwich', 'Desserts'
//     ];
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phoneNo: '',
//         address: { address: '', city: '', state: '' },
//         cuisines: [],
//         deliveryPrice: '',
//         deliveryTime: '',
//         image: null, // File object for image
//     });

//     const token = localStorage.getItem('token'); // Get the token from local storage

//     // Fetch restaurant profile data
//     const getMyProfile = async () => {
//         try {
//             const res = await axios.get("http://localhost:4000/api/restaurant/profile", {
//                 headers: { token },
//             });

//             const restaurant = res.data.restaurant;
//             setFormData({
//                 name: restaurant.name,
//                 email: restaurant.email,
//                 phoneNo: restaurant.phoneNo,
//                 address: {
//                     address: restaurant.address?.address || '',
//                     city: restaurant.address?.city || '',
//                     state: restaurant.address?.state || '',
//                 },
//                 cuisines: restaurant.cuisines || [],
//                 deliveryPrice: restaurant.deliveryPrice || '',
//                 deliveryTime: restaurant.estimatedDeliveryTime || '',
//                 image: restaurant.image|| null, // Placeholder for file input
//             });
//         } catch (error) {
//             console.error("Error fetching restaurant profile:", error);
//         }
//     };

//     useEffect(() => {
//         getMyProfile();
//     }, []);

//     // Handle input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     // Handle nested address input changes
//     const handleAddressChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             address: { ...prev.address, [name]: value },
//         }));
//     };

//     // Handle checkbox changes for cuisines
//     const handleCuisineChange = (e) => {
//         const { value } = e.target;
//         setFormData((prev) => {
//             const cuisines = prev.cuisines.includes(value)
//                 ? prev.cuisines.filter((cuisine) => cuisine !== value)
//                 : [...prev.cuisines, value];
//             return { ...prev, cuisines };
//         });
//     };

//     // Handle file input change
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setFormData((prev) => ({ ...prev, image: file }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const formDataToSubmit = new FormData();
//             formDataToSubmit.append('name', formData.name);
//             formDataToSubmit.append('phoneNo', formData.phoneNo);
//             formDataToSubmit.append('deliveryPrice', formData.deliveryPrice);
//             formDataToSubmit.append('estimatedDeliveryTime', formData.deliveryTime);
//             formDataToSubmit.append('cuisines', JSON.stringify(formData.cuisines));
//             formDataToSubmit.append('address', JSON.stringify(formData.address));
           

//             const res = await axios.put(
//                 "http://localhost:4000/api/restaurant/profile",
//                 formDataToSubmit,
//                 {
//                     headers: {
//                         token,
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );

//             console.log('Profile updated successfully:', res.data);
//             alert('Profile updated successfully!');
//         } catch (error) {
//             console.error('Error updating profile:', error);
//             alert('Failed to update profile. Please try again.');
//         }
//     };

//     return (
//         <div className="p-4 mx-3 md:mx-24 mt-5 rounded-lg shadow-lg bg-white">
//         <div>
//         <img
//           src={formData.image}
//           alt={formData.name}
//           className="w-full h-[200px] md:h-[400px] object-cover rounded-t-xl mb-2"
//         />
//         </div>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-6">
//                     <label className="block mb-2">Name</label>
//                     <input
//                         className="profileInput"
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         placeholder="Restaurant Name"
//                     />
//                 </div>

//                 {/* Email and Phone Number */}
//                 <div className="flex gap-4 mb-6">
//                     <div className="w-1/2">
//                         <label className="block mb-2">Email</label>
//                         <input
//                             className="profileInput"
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             disabled
//                         />
//                     </div>
//                     <div className="w-1/2">
//                         <label className="block mb-2">Phone Number</label>
//                         <input
//                             className="profileInput"
//                             type="text"
//                             name="phoneNo"
//                             value={formData.phoneNo}
//                             onChange={handleChange}
//                             placeholder="Phone Number"
//                         />
//                     </div>
//                 </div>

//                 {/* Address */}
//                 <h2 className="text-lg font-semibold mb-4">Address</h2>
//                 <div className="mb-6">
//                     <label className="block mb-2">Street Address</label>
//                     <input
//                         className="profileInput"
//                         type="text"
//                         name="address"
//                         value={formData.address.address}
//                         onChange={handleAddressChange}
//                         placeholder="Street Address"
//                     />
//                 </div>
//                 <div className="flex gap-4 mb-6">
//                     <div className="w-1/2">
//                         <label className="block mb-2">City</label>
//                         <input
//                             className="profileInput"
//                             type="text"
//                             name="city"
//                             value={formData.address.city}
//                             onChange={handleAddressChange}
//                             placeholder="City"
//                         />
//                     </div>
//                     <div className="w-1/2">
//                         <label className="block mb-2">State</label>
//                         <input
//                             className="profileInput"
//                             type="text"
//                             name="state"
//                             value={formData.address.state}
//                             onChange={handleAddressChange}
//                             placeholder="State"
//                         />
//                     </div>
//                 </div>

//                 {/* Cuisines */}
//                 <div className="mb-6">
//                     <label className="block mb-2">Cuisines</label>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                         {cuisineOptions.map((cuisine, index) => (
//                             <div key={index} className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     id={cuisine}
//                                     value={cuisine}
//                                     checked={formData.cuisines.includes(cuisine)}
//                                     onChange={handleCuisineChange}
//                                     className="mr-2"
//                                 />
//                                 <label htmlFor={cuisine}>{cuisine}</label>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Delivery Info */}
//                 <div className="flex gap-4 mb-6">
//                     <div className="w-1/2">
//                         <label className="block mb-2">Delivery Price</label>
//                         <input
//                             className="profileInput"
//                             type="number"
//                             name="deliveryPrice"
//                             value={formData.deliveryPrice}
//                             onChange={handleChange}
//                             placeholder="Price"
//                         />
//                     </div>
//                     <div className="w-1/2">
//                         <label className="block mb-2">Delivery Time</label>
//                         <input
//                             className="profileInput"
//                             type="number"
//                             name="deliveryTime"
//                             value={formData.deliveryTime}
//                             onChange={handleChange}
//                             placeholder="Time in Minutes"
//                         />
//                     </div>
//                 </div>

//                 <div className="mt-4">
//                     <button type="submit" className="button">Save Changes</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default MyRestaurant;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyRestaurant = () => {
    const cuisineOptions = [
        'Biryani', 'Pizza', 'South Indian', 'Burgers', 'Chinese',
        'Cakes', 'Shake', 'North Indian', 'Ice-Cream', 'Pasta',
        'Noodles', 'Rolls', 'Salad', 'Sandwich', 'Desserts'
    ];
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNo: '',
        address: { address: '', city: '', state: '' },
        cuisines: [],
        deliveryPrice: '',
        deliveryTime: '',
        image: null, // File object for image
    });

    const token = localStorage.getItem('token'); // Get the token from local storage

    // Fetch restaurant profile data
    const getMyProfile = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/restaurant/profile", {
                headers: { token },
            });

            const restaurant = res.data.restaurant;
            setFormData({
                name: restaurant.name,
                email: restaurant.email,
                phoneNo: restaurant.phoneNo,
                address: {
                    address: restaurant.address?.address || '',
                    city: restaurant.address?.city || '',
                    state: restaurant.address?.state || '',
                },
                cuisines: restaurant.cuisines || [],
                deliveryPrice: restaurant.deliveryPrice || '',
                deliveryTime: restaurant.estimatedDeliveryTime || '',
                image: restaurant.image || null,
            });
        } catch (error) {
            console.error('Error fetching restaurant profile:', error);
            toast.error('Failed to load profile data.');
        }
    };

    useEffect(() => {
        getMyProfile();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle nested address input changes
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value },
        }));
    };

    // Handle checkbox changes for cuisines
    const handleCuisineChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => {
            const cuisines = prev.cuisines.includes(value)
                ? prev.cuisines.filter((cuisine) => cuisine !== value)
                : [...prev.cuisines, value];
            return { ...prev, cuisines };
        });
    };

    // Handle file input change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('name', formData.name);
            formDataToSubmit.append('phoneNo', formData.phoneNo);
            formDataToSubmit.append('deliveryPrice', formData.deliveryPrice);
            formDataToSubmit.append('estimatedDeliveryTime', formData.deliveryTime);
            formDataToSubmit.append('cuisines', JSON.stringify(formData.cuisines));
            formDataToSubmit.append('address', JSON.stringify(formData.address));

            const res = await axios.put(
                "http://localhost:4000/api/restaurant/profile",
                formDataToSubmit,
                {
                    headers: {
                        token,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="p-4 mx-3 md:mx-24 my-5 rounded-lg shadow-lg bg-white">
            <ToastContainer position="top-right" autoClose={3000} />
            <div>
                <img
                    src={formData.image}
                    alt={formData.name}
                    className="w-full h-[200px] md:h-[400px] object-cover rounded-t-xl mb-2"
                />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block mb-2">Name</label>
                    <input
                        className="profileInput"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Restaurant Name"
                    />
                </div>

                {/* Email and Phone Number */}
                <div className="flex gap-4 mb-6">
                    <div className="w-1/2">
                        <label className="block mb-2">Email</label>
                        <input
                            className="profileInput"
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-2">Phone Number</label>
                        <input
                            className="profileInput"
                            type="text"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleChange}
                            placeholder="Phone Number"
                        />
                    </div>
                </div>

                {/* Address */}
                <h2 className="text-lg font-semibold mb-4">Address</h2>
                <div className="mb-6">
                    <label className="block mb-2">Street Address</label>
                    <input
                        className="profileInput"
                        type="text"
                        name="address"
                        value={formData.address.address}
                        onChange={handleAddressChange}
                        placeholder="Street Address"
                    />
                </div>
                <div className="flex gap-4 mb-6">
                    <div className="w-1/2">
                        <label className="block mb-2">City</label>
                        <input
                            className="profileInput"
                            type="text"
                            name="city"
                            value={formData.address.city}
                            onChange={handleAddressChange}
                            placeholder="City"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-2">State</label>
                        <input
                            className="profileInput"
                            type="text"
                            name="state"
                            value={formData.address.state}
                            onChange={handleAddressChange}
                            placeholder="State"
                        />
                    </div>
                </div>

                {/* Cuisines */}
                <div className="mb-6">
                    <label className="block mb-2">Cuisines</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {cuisineOptions.map((cuisine, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={cuisine}
                                    value={cuisine}
                                    checked={formData.cuisines.includes(cuisine)}
                                    onChange={handleCuisineChange}
                                    className="mr-2"
                                />
                                <label htmlFor={cuisine}>{cuisine}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="flex gap-4 mb-6">
                    <div className="w-1/2">
                        <label className="block mb-2">Delivery Price</label>
                        <input
                            className="profileInput"
                            type="number"
                            name="deliveryPrice"
                            value={formData.deliveryPrice}
                            onChange={handleChange}
                            placeholder="Price"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-2">Delivery Time</label>
                        <input
                            className="profileInput"
                            type="number"
                            name="deliveryTime"
                            value={formData.deliveryTime}
                            onChange={handleChange}
                            placeholder="Time in Minutes"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <button type="submit" className="button">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default MyRestaurant;
