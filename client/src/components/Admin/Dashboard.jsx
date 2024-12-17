import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeRestaurants: 0,
  });
  const [orders, setOrders] = useState([]);
  const [orderTrends, setOrderTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOrderCost, setTotalOrderCost] = useState(0);

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const [userRes, orderRes, restaurantRes] = await Promise.all([
        axios.get("http://localhost:4000/api/user/all"),
        axios.get("http://localhost:4000/api/order/all"),
        axios.get("http://localhost:4000/api/rest/all"),
      ]);

      // Calculate total revenue and trends
     
      const trends = orderRes.data.orders.slice(-10).map((order, index) => ({
        x: `Order ${index + 1}`,
        y: order.orderTotal,
      }));

      const totalCost = orderRes.data.orders.reduce(
        (acc, order) => acc + (order.orderTotal || 0),
        0
      );

      setStats({
        totalUsers: userRes.data.users.length,
        totalOrders: orderRes.data.orders.length,
        totalRevenue: totalCost,
        activeRestaurants: restaurantRes.data.restaurants.length,
      });

      

      setOrders(orderRes.data.orders);
      setOrderTrends(trends);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Doughnut Chart Data
  const doughnutData = {
    labels: ["Users", "Orders", "Restaurants"],
    datasets: [
      {
        data: [stats.totalUsers, stats.totalOrders, stats.activeRestaurants],
        backgroundColor: ["#fc802e", "#4caf50", "#2196f3"],
        hoverBackgroundColor: ["#e57222", "#43a047", "#1e88e5"],
      },
    ],
  };

  // Line Chart Data
  const lineData = {
    labels: orderTrends.map((trend) => trend.x),
    datasets: [
      {
        label: "Order Revenue (₹)",
        data: orderTrends.map((trend) => trend.y),
        borderColor: "#fc802e",
        fill: false,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Users" value={stats.totalUsers} />
            <StatCard title="Total Orders" value={stats.totalOrders} />
            <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} />
            <StatCard title="Active Restaurants" value={stats.activeRestaurants} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 shadow rounded-lg">
              <h3 className="text-gray-700 font-semibold mb-4">User & Order Distribution</h3>
              <Doughnut data={doughnutData} />
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h3 className="text-gray-700 font-semibold mb-4">Order Revenue Trends</h3>
              <Line data={lineData} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 shadow rounded-lg mt-6">
            <h3 className="text-gray-700 font-semibold mb-4">Recent Orders</h3>
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-gray-600">Order {index + 1}</td>
                    <td className="py-3 px-4 text-gray-600">{order.user?.username}</td>
                    <td className="py-3 px-4 text-gray-600">₹{order.orderTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition-shadow">
    <h3 className="text-gray-700 text-lg font-semibold">{title}</h3>
    <p className="text-[#fc802e] text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default Dashboard;
