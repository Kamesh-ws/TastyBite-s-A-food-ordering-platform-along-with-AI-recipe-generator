import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const limit = 10; // Records per page

  // Fetch orders from the API
  const fetchOrders = async (currentPage) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/order/all?page=${currentPage}&limit=${limit}`
      );
      setOrders(response.data.orders); // Assuming 'orders' is the key for orders in API response
      setTotalPages(response.data.pages); // Assuming 'pages' is the total page count
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  return (
    <>
      {loading ? (
        <div className="text-gray-600 text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700">Order ID</th>
                <th className="py-3 px-4 text-left text-gray-700">Customer</th>
                <th className="py-3 px-4 text-left text-gray-700">Restaurant</th>
                <th className="py-3 px-4 text-left text-gray-700">Items</th>
                <th className="py-3 px-4 text-left text-gray-700">Total</th>
                <th className="py-3 px-4 text-left text-gray-700">Status</th>
                <th className="py-3 px-4 text-left text-gray-700">Delivery Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="py-3 px-4 text-gray-600">{order._id}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {order.user?.username || "N/A"}
                    <br />
                    <span className="text-sm text-gray-500">
                      {order.user?.email}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {order.restaurant[0]?.restaurantid?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {order.items.map((item, i) => (
                      <div key={i}>
                        {item.menuItem?.name || "N/A"} - {item.quantity} x ₹
                        {item.price}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                  ₹{order.orderTotal.toFixed(2)}
                  </td>
                  <td
                    className={`py-3 px-4 ${
                      order.orderStatus === "Delivered"
                        ? "text-green-500"
                        : order.orderStatus === "Cancelled"
                        ? "text-red-500"
                        : "text-[#fc802e]"
                    }`}
                  >
                    {order.orderStatus}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {order.deliveryTime ? `${order.deliveryTime} min` : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-gray-600 text-center py-4">No orders found.</div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Orders;
