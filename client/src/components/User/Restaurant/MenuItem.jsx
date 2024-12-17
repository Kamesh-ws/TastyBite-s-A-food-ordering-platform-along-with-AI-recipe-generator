// import React, { useState, useEffect } from 'react';
// import { useCart } from '../CartContext';
// import { FaStar, FaRegStar } from "react-icons/fa";
// import addIcon from '../../../assets/add_icon_white.png';
// import addIconActive from '../../../assets/add_icon_green.png';
// import removeIcon from '../../../assets/remove_icon_red.png';

// const MenuItem = ({ img, id, name, price, rating, description, isVeg, offerPrice, startHour,endHour, onClick }) => {
//   const { addToCart, removeFromCart, cartItems } = useCart();
//   const [itemCount, setItemCount] = useState(0);

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
//     // Initialize the item count from the cart context
//     const itemInCart = cartItems.find((item) => item.id === id);
//     setItemCount(itemInCart ? itemInCart.quantity : 0);
//   }, [cartItems, id]);

//   const handleAddItem = () => {
//     setItemCount((prev) => prev + 1);
//     addToCart({ id, name, price, img, offerPrice });
//   };

//   const handleRemoveItem = () => {
//     if (itemCount > 0) {
//       setItemCount((prev) => prev - 1);
//       removeFromCart(id);
//     }
//   };

//   const discountedPrice = offerPrice
//     ? (price - (price * offerPrice / 100)).toFixed(2)
//     : price;
//   return (
//     <div className="w-full mx-auto rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer" >
//       <div className="relative">
//         <img
//           src={img}
//           alt={name}
//           className="w-full h-[200px] md:h-[250px] object-cover rounded-t-xl"
//         />
//         {!itemCount ? (
//           <img
//             className="w-10 absolute bottom-4 right-4 cursor-pointer rounded-full hover:scale-110 transition-transform"
//             onClick={handleAddItem}
//             src={addIcon}
//             alt="Add"
//           />
//         ) : (
//           <div className="absolute bottom-4 right-4 flex items-center gap-2 p-2 rounded-full bg-white shadow-lg">
//             <img
//               className="w-8 cursor-pointer hover:scale-110 transition-transform"
//               onClick={handleRemoveItem}
//               src={removeIcon}
//               alt="Remove"
//             />
//             <p className="font-semibold">{itemCount}</p>
//             <img
//               className="w-8 cursor-pointer hover:scale-110 transition-transform"
//               onClick={handleAddItem}
//               src={addIconActive}
//               alt="Add"
//             />
//           </div>
//         )}
//       </div>
//       <div className="p-5 bg-white rounded-b-xl" onClick={onClick}>
//         <div className="flex justify-between items-center mb-2">
//           <p className="text-lg md:text-xl font-semibold text-gray-800  truncate">{name}</p>
//           <div className="flex items-center">
//             <div className="flex">
//               {renderStars()}
//             </div>
//           </div>
//         </div>
//         <p className="text-gray-600 text-sm md:text-base mb-2 truncate">{description}</p>
//         <div className='flex items-center justify-between'>
//           <div className="text-right flex items-center gap-2">
//             {offerPrice ? (
//               <>
//                 <p className="text-gray-400 line-through">₹{price}</p>
//                 <p className="text-primary text-xl font-semibold">₹{discountedPrice}</p>
//               </>
//             ) : (
//               <p className="text-primary text-xl font-semibold">₹{price}</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuItem;

import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { FaStar, FaRegStar } from "react-icons/fa";
import addIcon from '../../../assets/add_icon_white.png';
import addIconActive from '../../../assets/add_icon_green.png';
import removeIcon from '../../../assets/remove_icon_red.png';

const MenuItem = ({ img, id, name, price, rating, description, isVeg, offerPrice, start, end, onClick }) => {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const [itemCount, setItemCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  const renderStars = () => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const starsArray = [];

    for (let i = 0; i < filledStars; i++) {
      starsArray.push(<FaStar key={i} className="text-yellow-500" />);
    }

    for (let i = filledStars; i < totalStars; i++) {
      starsArray.push(<FaRegStar key={i} className="text-yellow-500" />);
    }

    return starsArray;
  };

  const checkAvailability = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= start && currentHour < end) {
      setIsAvailable(true);
      setAvailabilityMessage('');
    } else {
      setIsAvailable(false);
      if(end>12){
        end=end-12;
        setAvailabilityMessage(`Available at${start}:00 to ${end}:00`);
      }
      else{
        setAvailabilityMessage(`Available at${start}:00 to ${end}:00`);
      } 
    }
  };

  useEffect(() => {
    // Initialize availability
    checkAvailability();

    // Update item count from the cart context
    const itemInCart = cartItems.find((item) => item.id === id);
    setItemCount(itemInCart ? itemInCart.quantity : 0);
  }, [cartItems, id]);

  const handleAddItem = () => {
    if (isAvailable) {
      setItemCount((prev) => prev + 1);
      addToCart({ id, name, price, img, offerPrice });
    }
  };

  const handleRemoveItem = () => {
    if (itemCount > 0) {
      setItemCount((prev) => prev - 1);
      removeFromCart(id);
    }
  };

  const discountedPrice = offerPrice
    ? (price - (price * offerPrice / 100)).toFixed(2)
    : price;

  return (
    <div className={`w-full mx-auto rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer ${!isAvailable ? 'opacity-80' : ''}`} >
      <div className="relative">
        <img
          src={img}
          alt={name}
          className="w-full h-[200px] md:h-[250px] object-cover rounded-t-xl"
        />
        {isAvailable ? (
          !itemCount ? (
            <img
              className="w-10 absolute bottom-4 right-4 cursor-pointer rounded-full hover:scale-110 transition-transform"
              onClick={handleAddItem}
              src={addIcon}
              alt="Add"
            />
          ) : (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 p-2 rounded-full bg-white shadow-lg">
              <img
                className="w-8 cursor-pointer hover:scale-110 transition-transform"
                onClick={handleRemoveItem}
                src={removeIcon}
                alt="Remove"
              />
              <p className="font-semibold">{itemCount}</p>
              <img
                className="w-8 cursor-pointer hover:scale-110 transition-transform"
                onClick={handleAddItem}
                src={addIconActive}
                alt="Add"
              />
            </div>
          )
        ) : (
          <div className="absolute bottom-4 right-4 bg-gray-100 p-2 rounded-full">
            <p className="text-sm text-gray-600">{availabilityMessage}</p>
          </div>
        )}
      </div>
      <div className="p-5 bg-white rounded-b-xl" onClick={onClick}>
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg md:text-xl font-semibold text-gray-800 truncate">{name}</p>
          <div className="flex items-center">
            <div className="flex">
              {renderStars()}
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm md:text-base mb-2 truncate">{description}</p>
        <div className='flex items-center justify-between'>
          <div className="text-right flex items-center gap-2">
            {offerPrice ? (
              <>
                <p className="text-gray-400 line-through">₹{price}</p>
                <p className="text-primary text-xl font-semibold">₹{discountedPrice}</p>
              </>
            ) : (
              <p className="text-primary text-xl font-semibold">₹{price}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
