import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from 'axios';
import { useCart } from '../CartContext';
import addIcon from '../../../assets/add_icon_white.png';
import addIconActive from '../../../assets/add_icon_green.png';
import removeIcon from '../../../assets/remove_icon_red.png';

const MenuDetail = () => {
    const { id: menuId } = useParams();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart, removeFromCart, cartItems } = useCart();
    const [itemCount, setItemCount] = useState(0);

    const renderStars = () => {
        const totalStars = 5;
        const filledStars = Math.floor(menu.ratings);
        const starsArray = [];

        for (let i = 0; i < filledStars; i++) {
            starsArray.push(<FaStar key={i} className="text-yellow-500" />);
        }

        for (let i = filledStars; i < totalStars; i++) {
            starsArray.push(<FaRegStar key={i} className="text-yellow-500" />);
        }

        return starsArray;
    };

    const renderStars1 = (rating) => {
        const totalStars = 5;
        const filledStars = Math.floor(rating);
        const starsArray = [];

        for (let i = 0; i < filledStars; i++) {
            starsArray.push(<FaStar key={i} className="text-yellow-500" />);
        }

        for (let i = filledStars; i < totalStars; i++) {
            starsArray.push(<FaRegStar key={i} className="text-yellow-500" />);
        }

        return starsArray;
    };


    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/restaurant/menu/${menuId}`);
                setMenu(res.data.menu);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching menu details:", error);
                setLoading(false);
            }
        };

        fetchMenu();
    }, [menuId]);

    useEffect(() => {
        const itemInCart = cartItems.find((item) => item.id === menuId);
        setItemCount(itemInCart ? itemInCart.quantity : 0);
    }, [cartItems, menuId]);

    const handleAddItem = () => {
        setItemCount((prev) => prev + 1);
        addToCart({ id: menuId, name: menu.name, price: menu.price, img: menu.image, offerPrice: menu.offer });
    };

    const handleRemoveItem = () => {
        if (itemCount > 0) {
            setItemCount((prev) => prev - 1);
            removeFromCart(menuId);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!menu) return <p>Menu not found.</p>;

    return (
        <div className="menu-detail-container flex flex-col mx-4 md:mx-24 mt-5">
            <div className="menu-info bg-white shadow p-5 rounded-lg mb-5 relative">
                <div className="flex items-start">
                    <img src={menu.image} alt={menu.name} className="w-40 h-40 object-cover rounded mr-4" />
                    <div className="flex flex-col flex-grow">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-semibold">{menu.name}</h2>
                            {!itemCount ? (
                                <img
                                    className="w-10 cursor-pointer rounded-full hover:scale-110 transition-transform"
                                    onClick={handleAddItem}
                                    src={addIcon}
                                    alt="Add"
                                />
                            ) : (
                                <div className="flex items-center gap-2 p-2 rounded-full bg-white shadow-lg">
                                    <img
                                        className="w-8 cursor-pointer hover:scale-110 transition-transform"
                                        onClick={handleRemoveItem}
                                        src={removeIcon}
                                        alt="Remove"
                                    />
                                    <p className="font-semibold">{itemCount}</p>
                                    <img
                                        className="w-8 cursor-pointer hover:scale-110 transition-transform"
                                        onClick={handleAddItem}
                                        src={addIconActive}
                                        alt="Add"
                                    />
                                </div>
                            )}
                        </div>
                        <p className="text-lg mt-2 text-gray-700">{menu.description}</p>
                        <p className="text-xl font-semibold text-green-600 mt-3">₹{menu.price}</p>
                        <div className="flex items-center mt-2">
                            <span className="flex">{renderStars()}</span>
                            <span className="text-gray-600 ml-2">({menu.reviews.length} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="reviews-section bg-white shadow p-5 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
                {menu.reviews && menu.reviews.length > 0 ? (
                    <div className="review-list space-y-4">
                        {menu.reviews.map((review, index) => (
                            <div key={index} className="review-item border-b pb-4 mb-4">
                                <div className="flex  items-center mb-2">
                                <p className="text-gray-600 ml-2 text-2xl font-bold">{review.name}</p>
                                    <p className="text-yellow-500 font-bold">{review.rating} ★</p>
                                    
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No reviews yet.</p>
                )}
            </div> */}
            <div className="reviews-section bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-3xl font-semibold mb-6 text-gray-800">Reviews</h3>
                {menu.reviews && menu.reviews.length > 0 ? (
                    <div className="review-list space-y-6">
                        {menu.reviews.map((review, index) => (
                            <div key={index} className="review-item border-b pb-4 mb-4 last:border-none last:mb-0">
                                <div className="flex items-center mb-3 ">
                                    <p className="text-lg font-bold text-gray-800 capitalize">{review.name}</p>
                                    <div className="flex items-center text-yellow-500 ml-10">
                                        <span className="flex">{renderStars1(review.rating)}</span>
                                    </div>

                                </div>
                                <p className="text-gray-700 text-md leading-relaxed border-l-4 pl-3 border-[#fc802e]">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center text-lg">No reviews yet.</p>
                )}
            </div>

        </div>
    );
};

export default MenuDetail;
