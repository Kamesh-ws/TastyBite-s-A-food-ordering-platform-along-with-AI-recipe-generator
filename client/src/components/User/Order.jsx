// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Order = () => {
//   const [orderDatas, setOrderDatas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/order/view', {
//           headers: { token },
//         });
//         setOrderDatas(response.data.orders || []); // Safely handle empty response
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || "Something went wrong");
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="flex flex-col mx-4 md:mx-24 mt-5 bg-gray-100 p-5 rounded-md shadow-md">
//       {orderDatas.length === 0 ? (
//         <p className="text-gray-600">No orders available.</p>
//       ) : (
//         orderDatas.map((order, index) => (
//           <div key={index} className="mb-10 bg-white p-5">
//             {/* Order Header */}
//             <div className="flex justify-between items-center font-bold text-2xl ">
//               <div className="flex gap-2">
//                 <h1>Order Status:</h1>
//                 <p className="text-blue-600">{order.orderStatus}</p>
//               </div>
//               <div className="flex gap-2">
//                 <h1>Expected By:</h1>
//                 <p className="text-green-600">
//                   {(() => {
//                     const createdDate = new Date(order.createdAt); // Parse the created time
//                     const deliveryDuration = order.deliveryTime; // Delivery time in minutes
//                     const expectedDate = new Date(createdDate.getTime() + deliveryDuration * 60000); // Add delivery time in milliseconds
//                     return expectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format to HH:MM
//                   })()}
//                 </p>
//               </div>
//             </div>
//             <div>
//             <button className='p-2 rounded-md bg-red-500 text-white '>Cancel Order</button>
//             </div>

//             {/* Delivery Address */}
//             <div className="mt-5">
//               <h1 className="font-semibold text-lg">Delivering to:</h1>
//               <p className="text-gray-700">{order.shippingDetails.name}</p>
//               <p className="text-gray-700">
//                 {order.shippingDetails.address}, {order.shippingDetails.city},{" "}
//                 {order.shippingDetails.state}
//               </p>
//               <p className="text-gray-700">Phone: {order.shippingDetails.phoneNo}</p>
//             </div>

//             {/* Order Items */}
//             <div className="mt-5">
//               <h1 className="font-semibold text-lg">Your Order:</h1>
//               <ul>
//                 {order.items.map((item) => (
//                   <li
//                     key={item._id}
//                     className="flex justify-between items-center mt-2"
//                   >
//                     <p>
//                       {item.name} x {item.quantity}
//                     </p>
//                     <p>₹{item.price * item.quantity}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Restaurants */}
//             <div className="mt-5">
//               <h1 className="font-semibold text-lg">Restaurants:</h1>
//               {order.restaurant.length === 0 ? (
//                 <p className="text-gray-700">No restaurants linked to this order.</p>
//               ) : (
//                 <ul>
//                   {order.restaurant.map((res, resIndex) => (
//                     <li key={resIndex} className="flex justify-between items-center mt-2">
//                       <p className="text-gray-700">{res.restaurantid?.name || "Unknown Restaurant"}</p>
//                       <p className="text-gray-600">Status: {res.status || "N/A"}</p>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* Order Total */}
//             <div className="mt-5 flex justify-between items-center font-bold text-xl">
//               <h1>Total:</h1>
//               <p>₹{order.orderTotal}</p>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Order;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Order = () => {
  const [orderDatas, setOrderDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/order/view', {
          headers: { token },
        });
        setOrderDatas(response.data.orders || []); // Safely handle empty response
        setLoading(false);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete('http://localhost:4000/api/order/delete', {
        headers: { token },
        data: { id: orderId }, // Send the order ID in the request body
      });

      if (response.status === 200) {
        setOrderDatas(orderDatas.filter(order => order._id !== orderId)); // Remove the deleted order from state
        alert("Order deleted successfully!");
      }
    } catch (err) {
      alert("Error deleting order: " + err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col mx-4 md:mx-24 mt-5 bg-gray-100 p-5 rounded-md shadow-md">
      {orderDatas.length === 0 ? (
        <p className="text-gray-600">No orders available.</p>
      ) : (
        orderDatas.map((order, index) => (
          <div key={index} className="mb-10 bg-white p-5">
            {/* Order Header */}
            <div className="flex justify-between items-center font-bold text-2xl ">
              <div className="flex gap-2">
                <h1>Order Status:</h1>
                <p className="text-blue-600">{order.orderStatus}</p>
              </div>
              <div className="flex gap-2">
                <h1>Expected By:</h1>
                <p className="text-green-600">
                  {(() => {
                    const createdDate = new Date(order.createdAt); // Parse the created time
                    const deliveryDuration = order.deliveryTime; // Delivery time in minutes
                    const expectedDate = new Date(createdDate.getTime() + deliveryDuration * 60000); // Add delivery time in milliseconds
                    return expectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format to HH:MM
                  })()}
                </p>
              </div>
            </div>
            <div>
              <button
                className="p-2 rounded-md bg-red-500 text-white"
                onClick={() => handleDeleteOrder(order._id)} // Call delete function
              >
                Cancel Order
              </button>
            </div>

            {/* Delivery Address */}
            <div className="mt-5">
              <h1 className="font-semibold text-lg">Delivering to:</h1>
              <p className="text-gray-700">{order.shippingDetails.name}</p>
              <p className="text-gray-700">
                {order.shippingDetails.address}, {order.shippingDetails.city},{" "}
                {order.shippingDetails.state}
              </p>
              <p className="text-gray-700">Phone: {order.shippingDetails.phoneNo}</p>
            </div>

            {/* Order Items */}
            <div className="mt-5">
              <h1 className="font-semibold text-lg">Your Order:</h1>
              <ul>
                {order.items.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between items-center mt-2"
                  >
                    <p>
                      {item.name} x {item.quantity}
                    </p>
                    <p>₹{item.price * item.quantity}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Restaurants */}
            <div className="mt-5">
              <h1 className="font-semibold text-lg">Restaurants:</h1>
              {order.restaurant.length === 0 ? (
                <p className="text-gray-700">No restaurants linked to this order.</p>
              ) : (
                <ul>
                  {order.restaurant.map((res, resIndex) => (
                    <li key={resIndex} className="flex justify-between items-center mt-2">
                      <p className="text-gray-700">{res.restaurantid?.name || "Unknown Restaurant"}</p>
                      <p className="text-gray-600">Status: {res.status || "N/A"}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Order Total */}
            <div className="mt-5 flex justify-between items-center font-bold text-xl">
              <h1>Total:</h1>
              <p>₹{order.orderTotal}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Order;
