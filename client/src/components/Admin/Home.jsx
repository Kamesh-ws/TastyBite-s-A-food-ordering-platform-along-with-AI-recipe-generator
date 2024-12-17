// import React, { useEffect, useState } from "react";
// import { BiSolidDish } from "react-icons/bi";
// import { TbRosetteDiscount } from "react-icons/tb";
// import { BiAddToQueue } from "react-icons/bi";
// import { AiOutlineOpenAI } from "react-icons/ai";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Home = () => {
//   const [data, setData] = useState({
//     totalUsers: 0,
//     totalOrders: 0,
//     totalRestaurants: 0,
//     totalRevenue: 0,
//     recentOrders: [],
//   });

//   const fetchAllData = async () => {
//     try {
//       // Fetch the first page of each entity (or adjust if API supports fetching all)
//       const [userRes, orderRes, restaurantRes] = await Promise.all([
//         axios.get("http://localhost:4000/api/user/all?page=1&limit=1000"), // Adjust the limit as needed
//         axios.get("http://localhost:4000/api/order/all?page=1&limit=1000"),
//         axios.get("http://localhost:4000/api/rest/all?page=1&limit=1000"),
//       ]);

//       const totalRevenue = orderRes.data.orders.reduce(
//         (acc, order) => acc + (order.total || 0),
//         0
//       );

//       setData({
//         totalUsers: userRes.data.users.length,
//         totalOrders: orderRes.data.orders.length,
//         totalRestaurants: restaurantRes.data.restaurants.length,
//         totalRevenue,
//         recentOrders: orderRes.data.orders.slice(0, 3), // Fetch only 3 recent orders
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const Links = [
//     { id: 1, name: "Dashboard", link: "/admin", logo: <BiSolidDish /> },
//     { id: 2, name: "User", link: "/admin/user", logo: <TbRosetteDiscount /> },
//     { id: 3, name: "Menu", link: "/admin/menu", logo: <BiAddToQueue /> },
//     { id: 4, name: "Restaurant", link: "/admin/restaurant", logo: <AiOutlineOpenAI /> },
//     { id: 5, name: "Order", link: "/admin/order", logo: <AiOutlineOpenAI /> },
//   ];

//   return (
//     <div className="flex flex-col md:flex-row bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-full md:w-1/5 bg-white shadow-lg md:block">
//         <div className="text-[#fc802e] font-bold text-xl p-4 border-b border-gray-200">
//           Admin Panel
//         </div>
//         {Links.map((item) => (
//           <Link
//             key={item.id}
//             to={item.link}
//             className="flex items-center gap-3 hover:text-[#fc802e]"
//           >
//             <ul className="p-4 space-y-2 w-full">
//               <li className="text-gray-700 hover:text-[#fc802e] py-2 border-b border-gray-200 cursor-pointer">
//                 <div className="flex  items-center gap-5">
//                   {item.logo} {item.name}
//                 </div>
//               </li>
//             </ul>
//           </Link>
//         ))}
//       </div>

//       {/* Main Dashboard */}
//       <div className="flex-1 p-6">
//         <div className="text-[#fc802e] text-2xl font-bold mb-6">Dashboard Overview</div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard title="Total Users" value={data.totalUsers} />
//           <StatCard title="Total Orders" value={data.totalOrders} />
//           <StatCard title="Active Restaurants" value={data.totalRestaurants} />
//           <StatCard title="Total Revenue" value={`$${data.totalRevenue}`} />
//         </div>

//         {/* Recent Orders */}
//         <div className="mt-6">
//           <h3 className="text-gray-700 text-xl font-semibold mb-4">Recent Orders</h3>
//           <table className="w-full bg-white shadow-md rounded-lg">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="text-left py-3 px-4 text-gray-700">Order ID</th>
//                 <th className="text-left py-3 px-4 text-gray-700">Customer Name</th>
//                 <th className="text-left py-3 px-4 text-gray-700">Status</th>
//                 <th className="text-left py-3 px-4 text-gray-700">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.recentOrders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50 transition">
//                   <td className="py-3 px-4 text-gray-600">{order._id}</td>
//                   <td className="py-3 px-4 text-gray-600">
//                     {order.user?.username || "N/A"}
//                   </td>
//                   <td className="py-3 px-4 text-[#fc802e]">{order.orderStatus}</td>
//                   <td className="py-3 px-4 text-gray-600">${order.total || 0}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // StatCard Component
// const StatCard = ({ title, value }) => (
//   <div className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition-shadow">
//     <h3 className="text-gray-700 text-lg font-semibold">{title}</h3>
//     <p className="text-[#fc802e] text-2xl font-bold mt-2">{value}</p>
//   </div>
// );

// export default Home;

import React, { useState } from "react";
import { BiSolidDish } from "react-icons/bi";
import { TbRosetteDiscount } from "react-icons/tb";
import { BiAddToQueue } from "react-icons/bi";
import { AiOutlineOpenAI } from "react-icons/ai";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoRestaurant } from "react-icons/io5";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import User from "./User";
import Menu from "./Menu";
import Restaurants from "./Restaurant";
import Orders from "./Order";
import Dash from './Dashboard'

// Placeholder Components for different pages
const Dashboard = () => <div className="p-6 text-gray-700">Dashboard Content</div>;
const UserManagement = () => <div className="p-6 text-gray-700">User Management Content</div>;
const MenuManagement = () => <div className="p-6 text-gray-700">Menu Management Content</div>;
const RestaurantManagement = () => <div className="p-6 text-gray-700">Restaurant Management Content</div>;
const OrderManagement = () => <div className="p-6 text-gray-700">Order Management Content</div>;

const Home = () => {
  const [activePage, setActivePage] = useState("dashboard"); // State to track the active page

  // Navigation Links
  const Links = [
    { id: "dashboard", name: "Dashboard", icon: <LuLayoutDashboard /> },
    { id: "user", name: "User Management", icon: <FaUsers /> },
    { id: "menu", name: "Menu Management", icon: <BiSolidDish/> },
    { id: "restaurant", name: "Restaurant Management", icon: <IoRestaurant /> },
    { id: "order", name: "Order Management", icon: <FaRegMoneyBillAlt /> },
  ];

  // Function to render the active page content
  const renderPageContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dash />;
      case "user":
        return <User/>;
      case "menu":
        return <Menu />;
      case "restaurant":
        return <Restaurants/>;
      case "order":
        return <Orders/>;
      default:
        return <Dash />;
    }
  };

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/6 bg-white shadow-lg">
        <div className="text-[#fc802e] font-bold text-xl p-4 border-b border-gray-200">
          Admin Panel
        </div>
        <ul className="space-y-2">
          {Links.map((link) => (
            <li
              key={link.id}
              onClick={() => setActivePage(link.id)} // Set active page on click
              className={`p-4 flex items-center gap-3 cursor-pointer ${
                activePage === link.id ? "bg-gray-200 text-[#fc802e]" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50">
        <div className="text-2xl font-bold text-[#fc802e] mb-4 capitalize">
          {activePage.replace(/-/g, " ")} {/* Format the active page name */}
        </div>
        {renderPageContent()} {/* Render the corresponding content */}
      </div>
    </div>
  );
};

export default Home;
