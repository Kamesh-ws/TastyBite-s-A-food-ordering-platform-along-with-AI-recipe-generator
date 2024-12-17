// import React, { useEffect, useState } from 'react';
// import { FaStar, FaRegStar } from "react-icons/fa";
// import axios from 'axios';

// const History = () => {
//   const [orderDatas, setOrderDatas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewPopup, setReviewPopup] = useState({ visible: false, menuId: null, orderId: null });
//   const [reviewText, setReviewText] = useState("");

//   const token = localStorage.getItem("token");

//   const renderStars = () => {
//     const totalStars = 5;
//     const filledStars = Math.floor(rating);
//     const starsArray = [];

//     for (let i = 0; i < filledStars; i++) {
//       starsArray.push(<FaStar key={i} className="text-yellow-500" />);
//     }

//     for (let i = filledStars; i < totalStars; i++) {
//       starsArray.push(<FaRegStar key={i} className="text-yellow-500" />);
//     }

//     return starsArray;
//   };


//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/order/dview', {
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

//   const handleAddReviewClick = (menuId, orderId) => {
//     setReviewPopup({ visible: true, menuId, orderId });
//   };

//   const handleReviewSubmit = async () => {
//     try {
//       await axios.post(
//         'http://localhost:4000/api/review/create',
//         {
//           menuId: reviewPopup.menuId,
//           orderId: reviewPopup.orderId,
//           review: reviewText,
//         },
//         {
//           headers: { token },
//         }
//       );
//       alert("Review added successfully!");
//       setReviewPopup({ visible: false, menuId: null, orderId: null });
//       setReviewText("");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to add review");
//     }
//   };

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
//                 <p className="text-green-600">{order.orderStatus}</p>
//               </div>
//               <div className="flex gap-2 text-xl">
//                 <h1>Total:</h1>
//                 <p>₹{order.orderTotal}</p>
//               </div>
//             </div>

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
//                     <div>
//                       <p>
//                         {item.name} x {item.quantity}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => handleAddReviewClick(item._id, order._id)}
//                       className="p-2 text-sm rounded-md bg-primary text-white"
//                     >
//                       Add Review
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ))
//       )}

//       {/* Review Popup */}
//       {reviewPopup.visible && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-5 rounded-md shadow-md w-96">
//             <h1 className="font-bold text-xl mb-4">Add Review</h1>
//             <div>
//             {renderStars()}
//             <textarea
//               className="w-full p-2 border border-gray-300 rounded-md"
//               rows="5"
//               placeholder="Write your review here..."
//               value={reviewText}
//               onChange={(e) => setReviewText(e.target.value)}
//             ></textarea>
//             </div>
//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 onClick={() => setReviewPopup({ visible: false, menuId: null, orderId: null })}
//                 className="px-4 py-2 bg-gray-300 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReviewSubmit}
//                 className="px-4 py-2 bg-primary text-white rounded-md"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default History;
import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from 'axios';

const History = () => {
  const [orderDatas, setOrderDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewPopup, setReviewPopup] = useState({ visible: false, menuId: null });
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/order/dview', {
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

  const handleAddReviewClick = (menuId) => {
    setReviewPopup({ visible: true, menuId });
    setRating(0); // Reset rating when the popup opens
    setReviewText(""); // Reset review text
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/menu/review',
        {
          menuName: reviewPopup.menuId,
          rating,
          comment: reviewText,
        },
        {
          headers: { token },
        }
      );
  
      alert(response.data.message || "Review submitted successfully!");
  
      const newReview = response.data.review[0]; // Assuming response.review is an array
      setOrderDatas((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          items: order.items.map((item) =>
            item.name === reviewPopup.menuId
              ? { ...item, review: newReview } // Attach the new review
              : item
          ),
        }))
      );
  
      setReviewPopup({ visible: false, menuId: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add review");
    }
  };
  
  
  const handleDeleteReview = async (menuId) => {
    try {
      await axios.delete(`http://localhost:4000/api/menu/review/${menuId}`, {
        headers: { token },
      });
      alert("Review deleted successfully!");
      setOrderDatas((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          items: order.items.map((item) =>
            item.name === menuId ? { ...item, review: null } : item
          ),
        }))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  const renderStars = () => {
    const totalStars = 5;
    const starsArray = [];
    for (let i = 1; i <= totalStars; i++) {
      starsArray.push(
        <span
          key={i}
          onClick={() => setRating(i)}
          className="cursor-pointer"
        >
          {i <= rating ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-yellow-500" />}
        </span>
      );
    }
    return starsArray;
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
                <p className="text-green-600">{order.orderStatus}</p>
              </div>
              <div className="flex gap-2 text-xl">
                <h1>Total:</h1>
                <p>₹{order.orderTotal}</p>
              </div>
            </div>

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
                    <div>
                      <p>
                        {item.name} x {item.quantity}
                      </p>
                      {item.review && (
                        <p className="text-sm text-gray-500 italic">
                          "{item.review.comment}" - {item.review.rating}⭐
                        </p>
                      )}
                    </div>
                    {!item.review ? (
                      <button
                        onClick={() => handleAddReviewClick(item.name)}
                        className="p-2 text-sm rounded-md bg-primary text-white"
                      >
                        Add Review
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteReview(item.name)}
                        className="p-2 text-sm rounded-md bg-red-500 text-white"
                      >
                        Delete Review
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}

      {/* Review Popup */}
      {reviewPopup.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md w-96">
            <h1 className="font-bold text-xl mb-4">Add Review</h1>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Rate this item:</h2>
              <div className="flex gap-1">{renderStars()}</div>
            </div>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="5"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setReviewPopup({ visible: false, menuId: null })}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
