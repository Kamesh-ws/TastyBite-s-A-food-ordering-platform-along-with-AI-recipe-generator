import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar, FaRegStar, FaEdit, FaTrashAlt } from "react-icons/fa";

const RMenuDetails = () => {
    const { id: menuId } = useParams();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const renderStars = (rating) => {
        const totalStars = 5;
        const filledStars = Math.floor(rating || 0);
        const starsArray = [];
        for (let i = 0; i < filledStars; i++) {
            starsArray.push(<FaStar key={i} className="text-yellow-500" />);
        }
        for (let i = filledStars; i < totalStars; i++) {
            starsArray.push(<FaRegStar key={i} className="text-gray-400" />);
        }
        return starsArray;
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/restaurant/menu/${menuId}`);
                setMenu(res.data.menu);
            } catch (error) {
                console.error("Error fetching menu details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [menuId]);

    const deleteHandler = async (e) => {
        e.preventDefault();
        const confirmDelete = window.confirm("Are you sure you want to delete this menu item?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:4000/api/restaurant/menu/${menuId}`, {
                    headers: { token: `${token}` },
                });
                navigate("/restaurant");
            } catch (error) {
                console.error("Error deleting menu item:", error);
            }
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader" />
            </div>
        );
    if (!menu) return <p className="text-center text-lg text-gray-600 mt-10">Menu not found.</p>;

    return (
        <div className="max-w-screen-lg mx-auto p-5">
            {/* Actions Section */}
            <div className="flex justify-end gap-4 mb-5">
                <Link
                    to={`/restaurant/menu/${menuId}`}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-[#eb8541] transition"
                >
                    <FaEdit className="mr-2" /> Edit
                </Link>
                <button
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-[#eb8541] transition"
                    onClick={deleteHandler}
                >
                    <FaTrashAlt className="mr-2" /> Delete
                </button>
            </div>

            {/* Menu Info Section */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-full md:w-48 h-48 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                        <h2 className="text-3xl font-bold text-gray-800">{menu.name}</h2>
                        <p className="mt-2 text-gray-700">{menu.description}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-lg font-bold text-green-600">₹{menu.price}</p>
                            <p className="text-lg font-bold text-primary">Offer: {menu.offer}%</p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-600">
                                Available: {menu.startHour} - {menu.endHour}
                            </p>
                            <p className="text-xl font-medium text-gray-600">
                                Quanity: <span className='text-green-600 font-bold'>{menu.quantity}</span>
                            </p>
                        </div>
                        <div className="mt-4 flex items-center">
                            {renderStars(menu.ratings)}
                            <span className="ml-2 text-sm text-gray-500">
                                ({menu.reviews?.length || 0} reviews)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white shadow-lg mt-6 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-5">Reviews</h3>
                {menu.reviews && menu.reviews.length > 0 ? (
                    menu.reviews.map((review, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-md shadow-sm mb-4 last:mb-0"
                        >
                            <div className="flex items-center mb-2">
                                <p className="text-lg font-bold text-gray-700">{review.name}</p>
                                <div className="ml-4 flex">{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default RMenuDetails;
