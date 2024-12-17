import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RHistory = () => {
  const [orders, setOrders] = useState([]); // Stores the list of orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const token = localStorage.getItem("token"); // Get JWT token from localStorage

  // Fetch orders when the component is mounted
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/restaurant/dorder/view', {
          headers: { token },
        });
        setOrders(response.data); // Save orders to state
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load orders. Please try again.');
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle status change for an order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log("Updating status:", { orderId, newStatus }); // Debug log
      await axios.put(
        'http://localhost:4000/api/restaurant/order/update-status',
        { orderId, status: newStatus },
        { headers: { token } }
      );
      // Update the status in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Order status updated successfully.');
    } catch (err) {
      console.error("Error updating order status:", err); // Debug log
      toast.error('Failed to update status. Please try again.');
    }
  };

  // Render a loading spinner while fetching orders
  if (loading) {
    return <div className="text-center mt-5">Loading orders...</div>;
  }

  // Show error message if something went wrong
  if (error) {
    return <div className="text-center mt-5 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col mx-4 md:mx-24 mt-5 bg-gray-100 p-6 rounded-lg shadow-md">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders available.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm mb-4">
            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-gray-600">Customer Name:</p>
                <p className="text-lg text-gray-800">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Delivery Address:</p>
                <p className="text-lg text-gray-800">{order.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Order Time:</p>
                <p className="text-lg text-gray-800">{new Date(order.orderTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Cost:</p>
                <p className="text-lg text-gray-800">₹{order.totalCost}</p>
              </div>
            </div>

            <hr className="my-4" />

            {/* Items in the Order */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Items</h3>
              {order.menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm mb-2"
                >
                  <p className="text-gray-700 font-medium">{item.name}</p>
                  <p className="text-gray-600">x{item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Status Update Dropdown */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">What is the status of this order?</p>
              <p  className="w-full text-green-500 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none">{order.status}</p>
              
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RHistory;
