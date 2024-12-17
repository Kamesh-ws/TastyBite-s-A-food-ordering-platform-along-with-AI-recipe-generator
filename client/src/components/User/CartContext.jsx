import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Increase quantity while keeping offerPrice intact
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1, offer: item.offerPrice || i.offer } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1, offer: item.offerPrice || 0 }];
    });
  };


  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id === id) {
          if (item.quantity === 1) return acc;
          return [...acc, { ...item, quantity: item.quantity - 1 }];
        }
        return [...acc, item];
      }, [])
    );
  };

  const deleteFromCart = (itemId, deleteEntireItem = false) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: deleteEntireItem ? 0 : item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Item count function
  // const itemCount = () => {
  //   return cartItems.reduce((total, item) => total + item.quantity, 0);
  // };

  const itemCount = () => {
    return cartItems.length; // Number of unique items in the cart
  };
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, deleteFromCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};
