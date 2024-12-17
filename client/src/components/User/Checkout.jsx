import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from './CartContext';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    phoneNumber: '',
    Email: '',
    userId: '',
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const token = localStorage.getItem('token');
  const { cartItems, clearCart } = useCart();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/user/profile`, {
          headers: { token: `${token}` },
        });
        const user = response.data.user;
        setShippingInfo({
          name: user.username,
          address: user.addresses.address,
          city: user.addresses.city,
          state: user.addresses.state,
          phoneNumber: user.phoneNo,
          email: user.email,
          userId: user._id,
        });
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.error('Access forbidden: Please login to access this resource');
        } else {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, [token]);

  const goToNextStep = () => setStep((prev) => prev + 1);
  const goToPreviousStep = () => setStep((prev) => prev - 1);

  return (
    <div className="container mx-auto p-6">
      {step === 1 && (
        <ShippingInfo
          shippingInfo={shippingInfo}
          setShippingInfo={setShippingInfo}
          goToNextStep={goToNextStep}
        />
      )}
      {step === 2 && (
        <ConfirmOrder
          shippingInfo={shippingInfo}
          goToPreviousStep={goToPreviousStep}
          items={cartItems}
        />
      )}
      
      {orderConfirmed && (
        <p className="text-center text-green-500 font-semibold mt-4">
          Order Confirmed! Thank you for your purchase.
        </p>
      )}
    </div>
  );
};

export default Checkout;

// ShippingInfo Component
const ShippingInfo = ({ shippingInfo, setShippingInfo, goToNextStep }) => {
  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="md:w-1/2 w-full">
        <form className="w-full flex flex-col justify-start p-6 rounded-md backdrop:blur-md shadow-xl space-y-3">
          <div className='flex flex-col justify-start '>
            <p className='text-xl font-bold'>Confirm Delivery Details</p>
            <span className=' text-sm text-gray-400'>View and change the profile information here</span>
          </div>
          <div className='flex flex-col'>
            <label>Email</label>
            <input
              name="Email"
              placeholder="Email"
              value={shippingInfo.email}
              onChange={handleChange}
              className="block w-full p-1 border border-gray-300 rounded-md"
            />
          </div>
          <div className='md:flex md:gap-2 items-center'>
            <div className='flex flex-col w-full'>
              <label>Name</label>
              <input
                name="Name"
                placeholder="Name"
                value={shippingInfo.name}
                onChange={handleChange}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className='flex flex-col w-full'>
              <label>Phone No</label>
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={shippingInfo.phoneNumber}
                onChange={handleChange}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className='flex flex-col'>
            <label>Street</label>
            <input
              name="address"
              placeholder="Address"
              value={shippingInfo.address}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className='md:flex md:gap-2 items-center'>

            <div className='flex flex-col w-full'>
              <label>City</label>
              <input
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={handleChange}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className='flex flex-col w-full'>
              <label>Country</label>
              <input
                name="state"
                placeholder="State"
                value={shippingInfo.state}
                onChange={handleChange}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />

            </div>
          </div>
          <button
            type="button"
            onClick={goToNextStep}
            className=" bg-[#ff8432] text-white py-2 px-4 rounded-md hover:bg-[#fa893d]"
          >
            Confirm Order
          </button>
        </form>
      </div>
    </div>

  );
};

// ConfirmOrder Component
const ConfirmOrder = ({ shippingInfo, goToPreviousStep, items }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  
  const calculateTotal = () => {
    const cartTotal = items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0; // Get price of the item
      const offer = parseFloat(item.offer) || 0; // Get the offer (discount percentage)
      const quantity = parseInt(item.quantity, 10) || 0; // Get quantity of the item
      console.log(offer);
      // Calculate the price after applying the offer
      return total + (price - (price * offer / 100)) * quantity;
    }, 0);

    const deliveryCharge = 100; // You can adjust this based on logic

    return (cartTotal + deliveryCharge).toFixed(2); // Return the final total after adding delivery charge

    
  };

  
  const createOrder = async () => {
    
    try {
      setLoading(true);

      // Step 1: Send order details to the backend to create the order and initiate Stripe session
      const response = await axios.post(
        "http://localhost:4000/api/order/create",
        {
          shippingDetails: {
            name: shippingInfo.name,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            phoneNo: shippingInfo.phoneNumber,
            email: shippingInfo.email,
          },
          cartItems: items.map((item) => ({
            menuItem: item.id, // Backend expects `menuItemId`
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          paymentMethod: "Stripe", // Can be extended for other methods
          products: items,
        },
        {
          headers: {
            token, // Pass user token for authentication
          },
        }
      );

      const { id: sessionId } = response.data;

      // Step 2: Redirect to Stripe Checkout
      const stripe = await loadStripe("Publickey");
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error(result.error.message);
        alert("Failed to redirect to payment. Please try again.");
      } 
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Order creation failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Confirm Order</h2>
      <div className="p-4 mb-4 rounded-md backdrop:blur-md shadow-xl">
        <div className="border p-4 mb-4 ">
          <h3 className="text-lg font-semibold">Shipping Details</h3>
          <p>Name: {shippingInfo.name}</p>
          <p>Address: {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}</p>
          <p>Phone Number: {shippingInfo.phoneNumber}</p>
        </div>

        <div className="border p-4 rounded mb-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{item.name} (x{item.quantity})</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold mt-2">
            <span>Cart Total:</span>
            <span>₹{calculateTotal() - 100}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge:</span>
            <span>₹100</span>
          </div>
          <div className="flex justify-between font-bold text-xl mt-2">
            <span>Total:</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>

        <div className="flex justify-between">
          <button onClick={goToPreviousStep} className="bg-gray-200 text-gray-800 p-2 md:py-2 md:px-4 rounded-md hover:bg-gray-300">Back to Shipping</button>
          <button
            onClick={createOrder}
            disabled={loading}
            className="bg-green-500 text-white p-2 md:py-2 md:px-4 rounded-md hover:bg-green-600 disabled:bg-green-300"
          >
            {loading ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </div>
      </div>
    </div>
  );
};

