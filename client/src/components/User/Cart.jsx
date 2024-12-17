import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { MdDeleteOutline } from "react-icons/md";
import addIcon from '../../assets/add_icon_green.png';
import removeIcon from '../../assets/remove_icon_red.png';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, deleteFromCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      navigate("/checkout");
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = () => {
    const itemsTotal = cartItems.reduce(
      (total, item) =>
        total +
        (item.offerPrice ? item.price - (item.price * item.offerPrice / 100) : item.price) * item.quantity,
      0
    );
    const deliveryCharge = cartItems.length > 0 ? 100 : 0;
    return (itemsTotal + deliveryCharge).toFixed(2);
  };

  const handleDeleteItem = (itemId) => {
    deleteFromCart(itemId, true); // pass 'true' to indicate full item removal
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <button
          onClick={clearCart}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Clear Cart
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <div className="space-y-4 md:w-3/4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg shadow-md">
                <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 ml-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    ₹{item.offerPrice ? (item.price - (item.price * item.offerPrice / 100)).toFixed(2) : item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    className="w-8 cursor-pointer hover:scale-110 transition-transform"
                    src={removeIcon}
                    alt="Remove"
                    onClick={() => removeFromCart(item.id)}
                  />
                  <span className="px-2">{item.quantity}</span>
                  <img
                    className="w-8 cursor-pointer hover:scale-110 transition-transform"
                    src={addIcon}
                    alt="Add"
                    onClick={() => addToCart(item)}
                  />
                </div>
                <div className='ml-3'>
                  <MdDeleteOutline
                    size={25}
                    className="cursor-pointer hover:text-red-600 transition"
                    onClick={() => handleDeleteItem(item.id)}
                  /></div>
              </div>
            ))}
            <div className="text-right font-semibold text-xl">
              Total: ₹{calculateTotal()}
            </div>
          </div>
        ) : (
          <div className="md:w-3/4 flex items-center justify-center p-4 border rounded-lg shadow-md">Your cart is empty.</div>
        )}

        {/* Cart Summary */}
        <div className="md:w-1/4 flex flex-col p-6 border rounded-lg shadow-md space-y-4 flex-grow">
          <h2 className="text-lg font-semibold">Cart Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>{item.name}</span>
              <div className="flex items-center gap-2">
                <span>{item.quantity}</span>
                <span>₹{(item.quantity * (item.offerPrice ? item.price - (item.price * item.offerPrice / 100) : item.price)).toFixed(2)}</span>
              </div>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2">
            <span>Delivery Charge</span>
            <span>₹100</span>
          </div>
          <div className="flex justify-between font-semibold text-xl border-t pt-2">
            <span>Total</span>
            <span>₹{calculateTotal()}</span>
          </div>
          <button className="bg-[#fc802e] text-white py-2 rounded mt-4 hover:bg-[#eb772a] transition" onClick={handleSubmit}>
            Go to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
