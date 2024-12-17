import React, { useEffect, useState } from "react";
import axios from "axios";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const limit = 10; // Records per page
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState(""); // Filter by restaurant name

  // Fetch menus from the API
  const fetchMenus = async (currentPage) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/menu/all?page=${currentPage}&limit=${limit}`
      );
      setMenus(response.data.menus); // Update menus data
      setTotalPages(response.data.pages); // Update total pages
    } catch (err) {
      setError("Failed to fetch menu items. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus(page);
  }, [page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

    // Filtered and sorted restaurants
    const filteredMenus = menus
    .filter((menu) =>
      menu.name.toLowerCase().includes(filter.toLowerCase())
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
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700">Name</th>
                  <th className="py-3 px-4 text-left text-gray-700">Price</th>
                  <th className="py-3 px-4 text-left text-gray-700">Description</th>
                  <th className="py-3 px-4 text-left text-gray-700">Cuisine</th>
                  <th className="py-3 px-4 text-left text-gray-700">Restaurant</th>
                  <th className="py-3 px-4 text-left text-gray-700">Availability</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenus.map((menu, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-3 px-4 text-gray-600">{menu.name}</td>
                    <td className="py-3 px-4 text-gray-600">₹{menu.price}</td>
                    <td className="py-3 px-4 text-gray-600 ">{menu.description}</td>
                    <td className="py-3 px-4 text-gray-600">{menu.cuisineType}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {menu.restaurant?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {menu.startHour !== undefined && menu.endHour !== undefined
                        ? `${menu.startHour}:00 - ${menu.endHour}:00`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMenus.length === 0 && (
              <div className="text-gray-600 text-center py-4">No menu items found.</div>
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

export default Menu;
