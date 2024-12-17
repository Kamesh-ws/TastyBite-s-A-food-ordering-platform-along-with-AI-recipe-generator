// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../User/CartContext';
// import { GiChickenLeg } from "react-icons/gi";
// import { FaRegUser } from "react-icons/fa";
// import { PiShoppingCart } from "react-icons/pi";
// import { BiAddToQueue } from "react-icons/bi";
// import { BiSolidOffer, BiSolidDish } from "react-icons/bi";
// import { IoMenu } from "react-icons/io5";
// import { IoMdClose } from "react-icons/io";
// import { TbRosetteDiscount } from "react-icons/tb";
// import { AiOutlineOpenAI } from "react-icons/ai";
// import { IoRestaurant } from "react-icons/io5";

// const UserLinks = [
//   { id: 1, name: 'Cuisine', link: '/cuisine', logo: <BiSolidDish /> },
//   { id: 2, name: 'Offers', link: '/offers', logo: <TbRosetteDiscount /> },
//   { id: 3, name: 'Restaurant', link: '/restaurant/signin', logo: <BiAddToQueue /> },
//   { id: 4, name: 'AI Recipe', link: '/recipe', logo: <AiOutlineOpenAI /> },
// ];

// const AdminLinks = [];

// const RestaurantLinks = [
//   { id: 1, name: 'Add Menu', link: '/restaurant/menu/new', logo: <BiSolidDish /> },
//   { id: 2, name: 'Special Dish', link: '/restaurant/special', logo: <BiSolidOffer /> },
//   { id: 3, name: 'Orders', link: '/restaurant/myorders', logo: <PiShoppingCart /> },
//   { id: 4, name: 'My Restaurant', link: '/restaurant/profile', logo: <IoRestaurant /> },
// ];

// const DropdownLinks = {
//   user: [
//     { id: 1, name: 'Profile', link: '/profile' },
//     { id: 2, name: 'My Orders', link: '/myorders' },
//     { id: 3, name: 'History', link: '/history' },
//   ],
//   restaurant: [
//     { id: 1, name: 'Profile', link: '/profile' },
//     { id: 2, name: 'My Orders', link: '/restaurant/myorders' },
//     { id: 3, name: 'History', link: '/restaurant/history' },
//   ],
//   admin: [
//     { id: 1, name: 'Dashboard', link: '/admin/dashboard' },
//     { id: 2, name: 'User Management', link: '/admin/users' },
//   ],
// };

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const navigate = useNavigate();
//   const isLoggedIn = localStorage.getItem('token');
//   const name = localStorage.getItem('name');
//   const role = localStorage.getItem('role');
//   const { itemCount } = useCart();

//   const isAdmin = role === 'admin';
//   const isRestaurant = role === 'restaurant';

//   const Links = isAdmin ? AdminLinks : isRestaurant ? RestaurantLinks : UserLinks;
//   const Dropdown = DropdownLinks[role] || [];

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/');
//   };

//   return (
//     <nav className='flex justify-between py-5 px-10 items-center bg-white shadow-md'>
//       {/* Logo */}
//       <div>
//         <Link
//           to={
//             role === 'restaurant'
//               ? '/restaurant'
//               : role === 'admin'
//                 ? '/admin'
//                 : '/'
//           }
//           className="flex items-center gap-1"
//         >
//           <h1 className="logo">Tasty Bites</h1>
//           <GiChickenLeg size={30} className="text-[#fc802e]" />
//         </Link>
//       </div>

//       {/* Desktop Navigation */}
//       <div className='hidden md:flex text-lg gap-5 items-center'>
//         {Links.map((item) => (
//           <Link key={item.id} to={item.link} className='flex items-center gap-3 hover:text-[#fc802e]'>
//             {item.logo}
//             <p>{item.name}</p>
//           </Link>
//         ))}

//         {/* Cart */}
//         {!isAdmin && !isRestaurant && (
//           <Link to='/cart' className='relative flex items-center gap-3 hover:text-[#fc802e]'>
//             <PiShoppingCart size={24} />
//             <span className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
//               {itemCount()}
//             </span>
//           </Link>
//         )}

//         {/* User Dropdown */}
//         {isLoggedIn ? (
//           <div className='relative'>
//             <button
//               className='flex items-center gap-2 cursor-pointer hover:text-[#fc802e]'
//               onClick={toggleDropdown}
//             >
//               <FaRegUser />
//               <span>{name}</span>
//             </button>

//             {isDropdownOpen && (
//               <div className='absolute top-full right-0 bg-white shadow-lg rounded-md py-2 w-40'>
//                 {Dropdown.map((item) => (
//                   <Link
//                     key={item.id}
//                     to={item.link}
//                     className='block px-4 py-2 hover:bg-gray-100'
//                     onClick={toggleDropdown}
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
//                 <button
//                   onClick={handleLogout}
//                   className='block w-full text-left px-4 py-2 hover:bg-gray-100'
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <Link to='/signin' className='flex items-center gap-3 hover:text-[#fc802e]'>
//             <FaRegUser />
//             <p>Sign in</p>
//           </Link>
//         )}
//       </div>

//       {/* Mobile Menu */}
//       <button className='block md:hidden text-3xl' onClick={toggleMenu}>
//         {isMenuOpen ? <IoMdClose /> : <IoMenu />}
//       </button>

//       {isMenuOpen && (
//         <div className='absolute top-16 left-0 w-full bg-white z-10 p-5 md:hidden flex flex-col gap-5'>
//           {Links.map((item) => (
//             <Link key={item.id} to={item.link} className='flex items-center gap-3 hover:text-[#fc802e]' onClick={toggleMenu}>
//               {item.logo}
//               <p>{item.name}</p>
//             </Link>
//           ))}
//           {!isAdmin && (
//             <Link to='/cart' className='flex items-center gap-3 hover:text-[#fc802e]' onClick={toggleMenu}>
//               <PiShoppingCart size={24} />
//               <p>Cart</p>
//             </Link>
//           )}
//           {isLoggedIn ? (
//             <div>
//               {Dropdown.map((item) => (
//                 <Link
//                   key={item.id}
//                   to={item.link}
//                   className='block px-4 py-2 hover:bg-gray-100'
//                   onClick={toggleMenu}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//               <button
//                 onClick={handleLogout}
//                 className='block text-left px-4 py-2 hover:bg-gray-100'
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <Link to='/signin' className='flex items-center gap-3 hover:text-[#fc802e]' onClick={toggleMenu}>
//               <FaRegUser />
//               <p>Sign in</p>
//             </Link>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../User/CartContext';
import { GiChickenLeg } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { PiShoppingCart } from "react-icons/pi";
import { BiAddToQueue, BiSolidOffer, BiSolidDish } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { TbRosetteDiscount } from "react-icons/tb";
import { AiOutlineOpenAI } from "react-icons/ai";
import { IoRestaurant } from "react-icons/io5";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const { itemCount } = useCart();

  const isAdmin = role === 'admin';
  const isRestaurant = role === 'restaurant';

  const Links = isAdmin
    ? []
    : isRestaurant
    ? [
        { id: 1, name: 'Add Menu', link: '/restaurant/menu/new', logo: <BiSolidDish /> },
        { id: 2, name: 'Special Dish', link: '/restaurant/special', logo: <BiSolidOffer /> },
        { id: 3, name: 'Orders', link: '/restaurant/myorders', logo: <PiShoppingCart /> },
        { id: 4, name: 'My Restaurant', link: '/restaurant/profile', logo: <IoRestaurant /> },
      ]
    : [
        { id: 1, name: 'Cuisine', link: '/cuisine', logo: <BiSolidDish /> },
        { id: 2, name: 'Offers', link: '/offers', logo: <TbRosetteDiscount /> },
        { id: 3, name: 'Restaurant', link: '/restaurant/signin', logo: <BiAddToQueue /> },
        { id: 4, name: 'AI Recipe', link: '/recipe', logo: <AiOutlineOpenAI /> },
      ];

  const Dropdown = {
    user: [
      { id: 1, name: 'Profile', link: '/profile' },
      { id: 2, name: 'My Orders', link: '/myorders' },
      { id: 3, name: 'History', link: '/history' },
    ],
    restaurant: [
      { id: 1, name: 'Profile', link: '/profile' },
      { id: 2, name: 'My Orders', link: '/restaurant/myorders' },
      { id: 3, name: 'History', link: '/restaurant/history' },
    ],
    admin: [
      { id: 1, name: 'Dashboard', link: '/admin/dashboard' },
      { id: 2, name: 'User Management', link: '/admin/users' },
    ],
  }[role] || [];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    closeMenus(); // Ensure all menus are closed
    navigate('/');
  };

  return (
    <nav className='flex justify-between py-5 px-10 items-center bg-white shadow-md'>
      {/* Logo */}
      <div>
        <Link to={role === 'restaurant' ? '/restaurant' : role === 'admin' ? '/admin' : '/'} className="flex items-center gap-1">
          <h1 className="logo">Tasty Bites</h1>
          <GiChickenLeg size={30} className="text-[#fc802e]" />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className='hidden md:flex text-lg gap-5 items-center'>
        {Links.map((item) => (
          <Link key={item.id} to={item.link} className='flex items-center gap-3 hover:text-[#fc802e]' onClick={closeMenus}>
            {item.logo}
            <p>{item.name}</p>
          </Link>
        ))}
        {!isAdmin && !isRestaurant && (
          <Link to='/cart' className='relative flex items-center gap-3 hover:text-[#fc802e]' onClick={closeMenus}>
            <PiShoppingCart size={24} />
            <span className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
              {itemCount()}
            </span>
          </Link>
        )}
        {isLoggedIn ? (
          <div className='relative'>
            <button className='flex items-center gap-2 cursor-pointer hover:text-[#fc802e]' onClick={toggleDropdown}>
              <FaRegUser />
              <span>{name}</span>
            </button>
            {isDropdownOpen && (
              <div className='absolute top-full right-0 bg-white shadow-lg rounded-md py-2 w-40'>
                {Dropdown.map((item) => (
                  <Link key={item.id} to={item.link} className='block px-4 py-2 hover:bg-gray-100' onClick={closeMenus}>
                    {item.name}
                  </Link>
                ))}
                <button onClick={handleLogout} className='block w-full text-left px-4 py-2 hover:bg-gray-100'>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to='/signin' className='flex items-center gap-3 hover:text-[#fc802e]'>
            <FaRegUser />
            <p>Sign in</p>
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      <button className='block md:hidden text-3xl' onClick={toggleMenu}>
        {isMenuOpen ? <IoMdClose /> : <IoMenu />}
      </button>
      {isMenuOpen && (
        <div className='absolute top-16 left-0 w-full bg-white z-10 p-5 md:hidden flex flex-col gap-5'>
          {Links.map((item) => (
            <Link key={item.id} to={item.link} className='flex items-center gap-3 hover:text-[#fc802e]' onClick={closeMenus}>
              {item.logo}
              <p>{item.name}</p>
            </Link>
          ))}
          {!isAdmin && (
            <Link to='/cart' className='flex items-center gap-3 hover:text-[#fc802e]' onClick={closeMenus}>
              <PiShoppingCart size={24} />
              <p>Cart</p>
            </Link>
          )}
          {isLoggedIn ? (
            <div>
              {Dropdown.map((item) => (
                <Link key={item.id} to={item.link} className='block px-4 py-2 hover:bg-gray-100' onClick={closeMenus}>
                  {item.name}
                </Link>
              ))}
              <button onClick={handleLogout} className='block text-left px-4 py-2 hover:bg-gray-100'>
                Logout
              </button>
            </div>
          ) : (
            <Link to='/signin' className='flex items-center gap-3 hover:text-[#fc802e]' onClick={closeMenus}>
              <FaRegUser />
              <p>Sign in</p>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
