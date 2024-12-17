import React, { useEffect, useState } from "react";
import axios from "axios";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const limit = 10; // Records per page
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState(""); // Filter by restaurant name

  // Fetch restaurants with pagination
  const fetchRestaurants = async (currentPage) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/rest/all?page=${currentPage}&limit=${limit}`
      );
      setRestaurants(response.data.restaurants);
      setTotalPages(response.data.pages); // Set total pages from API response
    } catch (err) {
      setError("Failed to fetch restaurants. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(page);
  }, [page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Filtered and sorted restaurants
  const filteredRestaurants = restaurants
    .filter((restaurant) =>
      restaurant.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
<>
      {/* Filter and Sort */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fc802e]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          className="bg-[#fc802e] text-white px-4 py-2 rounded-lg"
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          Sort by Name ({sortOrder})
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600 text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700">Restaurant Name</th>
                  <th className="py-3 px-4 text-left text-gray-700">Owner</th>
                  <th className="py-3 px-4 text-left text-gray-700">Cuisine</th>
                  <th className="py-3 px-4 text-left text-gray-700">Menu Items</th>
                  <th className="py-3 px-4 text-left text-gray-700">Special Menu</th>
                  <th className="py-3 px-4 text-left text-gray-700">Address</th>
                  <th className="py-3 px-4 text-left text-gray-700">Phone</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.map((restaurant, index) => (
                  <tr
                    key={index}
                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                  >
                    <td className="py-3 px-4 text-gray-600">{restaurant.name}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {restaurant.user?.username || "N/A"}
                      <br />
                      <span className="text-sm text-gray-500">
                        {restaurant.user?.email}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {restaurant.cuisines.join(", ")}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {restaurant.menu.length} items
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {restaurant.specialMenu.length} items
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {restaurant.address?.address || "N/A"}, {restaurant.address?.city || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{restaurant.phoneNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRestaurants.length === 0 && (
              <div className="text-gray-600 text-center py-4">
                No restaurants match the filter criteria.
              </div>
            )}
          </div>

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
      )}
</>
  );
};

export default Restaurants;
