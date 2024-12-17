import Stripe from "stripe";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Order } from "../models/order.js";
import { Restaurant } from "../models/restaurant.js";
import { User } from "../models/user.js";
import { Menu } from "../models/menu.js";
import { SpecialDish } from "../models/SpecialDish.js";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const createOrder = async (req, res) => {
//   try {
//     const { shippingDetails, cartItems, paymentMethod, products } = req.body;

//     if (!shippingDetails || !cartItems || cartItems.length === 0 || !paymentMethod) {
//       return res.status(400).json({ error: "Invalid order details provided" });
//     }

//     // Step 1: Fetch menu items and their respective restaurants
//     let menuItems = await Menu.find({ _id: { $in: cartItems.map(item => item.menuItem) } }).populate({
//       path: "restaurant",
//       select: "estimatedDeliveryTime", // Ensure this field exists in the restaurant schema
//     });

//     menuItems = await SpecialDish.find({ _id: { $in: cartItems.map(item => item.menuItem) } }).populate({
//       path: "restaurant",
//       select: "estimatedDeliveryTime", // Ensure this field exists in the restaurant schema
//     });

//     console.log("Menu Items with Restaurants:", menuItems);

//     // Step 2: Organize menu items by restaurant and calculate total delivery time
//     const restaurantMap = menuItems.reduce((acc, menu) => {
//       const { restaurant, _id, name, price } = menu;
//       const quantity = cartItems.find(item => item.menuItem === _id.toString()).quantity;

//       if (!acc[restaurant._id]) acc[restaurant._id] = { items: [], deliveryTime: restaurant.estimatedDeliveryTime || 0 };
//       acc[restaurant._id].items.push({ menuItem: _id, name, price, quantity });

//       // Debug: Display each restaurant's delivery time
//       console.log(`Restaurant ID: ${restaurant._id}, Estimated Delivery Time: ${restaurant.estimatedDeliveryTime}`);

//       return acc;
//     }, {});

//     // Step 3: Create restaurant array for the order
//     const restaurants = Object.keys(restaurantMap).map(restaurantId => ({
//       restaurantid: restaurantId,
//       status: "Confirmed",
//     }));

//     // Step 4: Calculate total order value
//     const orderTotal = Object.values(restaurantMap).flatMap(({ items }) => items).reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );

//     const total = orderTotal + 100;

//     // Step 5: Calculate total delivery time and average delivery time
//     const totalDeliveryTime = Object.values(restaurantMap).reduce(
//       (sum, { deliveryTime }) => sum + deliveryTime,
//       0
//     );

//     console.log("Total Delivery Time:", totalDeliveryTime);

//     const averageDeliveryTime = Object.keys(restaurantMap).length
//       ? Math.ceil(totalDeliveryTime / Object.keys(restaurantMap).length)
//       : 0; // Default to 0 if no restaurants

//     console.log("Average Delivery Time:", averageDeliveryTime);

//     // Step 6: Create the order
//     const order = await Order.create({
//       user: req.user.id,
//       restaurant: restaurants,
//       items: Object.values(restaurantMap).flatMap(({ items }) => items),
//       shippingDetails,
//       paymentDetails: { paymentMethod, paymentStatus: "Pending" },
//       orderTotal: total,
//       deliveryTime: averageDeliveryTime, // Correctly computed delivery time
//     });

//     // Step 7: Stripe payment session setup
//     const lineItems = products.map(product => ({
//       price_data: {
//         currency: "inr",
//         product_data: { name: product.name, images: [product.img] },
//         unit_amount: product.price * 100,
//       },
//       quantity: product.quantity,
//     }));

//     lineItems.push({
//       price_data: {
//         currency: "inr",
//         product_data: { name: "Additional Fee", images: [] },
//         unit_amount: 100 * 100,
//       },
//       quantity: 1,
//     });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `http://localhost:3000/order/verify?success=true&orderId=${order._id}`,
//       cancel_url: `http://localhost:3000/order/verify?success=false&orderId=${order._id}`,
//     });

//     // Respond with success
//     res.status(201).json({ success: true, id: session.id, orderId: order._id });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const createOrder = async (req, res) => {
  try {
    const { shippingDetails, cartItems, paymentMethod, products } = req.body;
    console.log("Request Body:", req.body);
    if (!shippingDetails || !cartItems || cartItems.length === 0 || !paymentMethod) {
      return res.status(400).json({ error: "Invalid order details provided" });
    }

    // Step 1: Fetch menu items from both collections
    const menuItemsFromMenu = await Menu.find({ 
      _id: { $in: cartItems.map(item => item.menuItem) }
    }).populate({
      path: "restaurant",
      select: "estimatedDeliveryTime", 
    });

    const menuItemsFromSpecialDish = await SpecialDish.find({ 
      _id: { $in: cartItems.map(item => item.menuItem) }
    }).populate({
      path: "restaurant",
      select: "estimatedDeliveryTime",
    });

    // Combine both results
    const menuItems = [...menuItemsFromMenu, ...menuItemsFromSpecialDish];

    // Step 2: Validate if all cart items were found
    const foundItemIds = menuItems.map(item => item._id.toString());
    const missingItems = cartItems.filter(item => !foundItemIds.includes(item.menuItem));

    if (missingItems.length > 0) {
      return res.status(400).json({
        error: "Some items in your cart are unavailable",
        missingItems,
      });
    }

    // Step 3: Organize menu items by restaurant
    const restaurantMap = menuItems.reduce((acc, menu) => {
      const { restaurant, _id, name, price } = menu;
      const quantity = cartItems.find(item => item.menuItem === _id.toString()).quantity;

      if (!acc[restaurant._id]) {
        acc[restaurant._id] = { items: [], deliveryTime: restaurant.estimatedDeliveryTime || 0 };
      }
      acc[restaurant._id].items.push({ menuItem: _id, name, price, quantity });

      return acc;
    }, {});

    // Step 4: Create restaurant array and calculate totals
    const restaurants = Object.keys(restaurantMap).map(restaurantId => ({
      restaurantid: restaurantId,
      status: "Confirmed",
    }));

    const orderTotal = Object.values(restaurantMap).flatMap(({ items }) => items).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const total = orderTotal + 100;

    const totalDeliveryTime = Object.values(restaurantMap).reduce(
      (sum, { deliveryTime }) => sum + deliveryTime,
      0
    );

    const averageDeliveryTime = Object.keys(restaurantMap).length
      ? Math.ceil(totalDeliveryTime / Object.keys(restaurantMap).length)
      : 0;

    // Step 5: Create the order
    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurants,
      items: Object.values(restaurantMap).flatMap(({ items }) => items),
      shippingDetails,
      paymentDetails: { paymentMethod, paymentStatus: "Pending" },
      orderTotal: total,
      deliveryTime: averageDeliveryTime,
    });

    // Step 6: Stripe payment session setup
    const lineItems = products.map(product => ({
      price_data: {
        currency: "inr",
        product_data: { name: product.name, images: [product.img] },
        unit_amount: (product.offerPrice ? (product.price - (product.price * product.offerPrice / 100)).toFixed(2) : product.price) * 100,
      },
      quantity: product.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Additional Fee", images: [] },
        unit_amount: 100 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:3000/order/verify?success=true&orderId=${order._id}`,
      cancel_url: `http://localhost:3000/order/verify?success=false&orderId=${order._id}`,
    });

    res.status(201).json({ success: true, id: session.id, orderId: order._id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (success === "true") {
      // Update the order details for successful payment
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentDetails: { paymentStatus: "Completed" },
          orderStatus: "Confirmed",
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Check if the order contains restaurant information
      if (Array.isArray(order.restaurant)) {
        // Extract restaurant IDs from order.restaurant
        const restaurantIds = order.restaurant.map((item) => item.restaurantid);

        console.log("Updating restaurants with IDs:", restaurantIds);

        // Update all matching restaurants by pushing the order ID
        const result = await Restaurant.updateMany(
          { _id: { $in: restaurantIds } }, // Match restaurants by IDs
          { $push: { orders: order._id } } // Add order ID to the orders array
        );

        console.log("UpdateMany result:", result);
      } else if (order.restaurant && order.restaurant.restaurantid) {
        // Handle single restaurant case
        const singleRestaurantId = order.restaurant.restaurantid;

        console.log("Updating single restaurant with ID:", singleRestaurantId);

        const result = await Restaurant.findByIdAndUpdate(
          singleRestaurantId,
          { $push: { orders: order._id } },
          { new: true }
        );

        console.log("findByIdAndUpdate result:", result);
      }

      return res.status(200).json({
        success: true,
        message: "Order confirmed",
        order,
      });
    } else {
      // Delete the order for unsuccessful payment
      const order = await Order.findById(orderId);
      if (order) {
        await Order.findByIdAndDelete(orderId);
      }
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    // Assuming `req.user` is populated by an authentication middleware like isAuth
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch orders for the user where paymentStatus is "Completed" and orderStatus is "Confirmed"
    const orders = await Order.find({
      user: userId,
      "paymentDetails.paymentStatus": "Completed", // Correct dot notation for nested field
      orderStatus: "Confirmed",
    })
      .sort({ createdAt: -1 }) // Sorting by most recent orders first
      .populate({
        path: "restaurant.restaurantid", // Populating the `restaurantid` field in the `restaurant` array
        select: "name estimatedDeliveryTime image", // Fetch only `deliveryTime` and `image` fields
      });

    // Respond with the orders
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDOrders = async (req, res) => {
  try {
    // Assuming `req.user` is populated by an authentication middleware like isAuth
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch orders for the user where paymentStatus is "Completed" and orderStatus is "Confirmed"
    const orders = await Order.find({
      user: userId,
      "paymentDetails.paymentStatus": "Completed", // Correct dot notation for nested field
      orderStatus: "Delivered",
    })
      .sort({ createdAt: -1 }) // Sorting by most recent orders first
      .populate({
        path: "restaurant.restaurantid", // Populating the `restaurantid` field in the `restaurant` array
        select: "name estimatedDeliveryTime image", // Fetch only `deliveryTime` and `image` fields
      });

    // Respond with the orders
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const getOrderRestaurant = async (req, res) => {
//   try {
//     const token = req.headers.token;

//     if (!token) {
//       return res.status(403).json({ message: 'Please login to access' });
//     }

//     // Verify JWT
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decodedData._id);

//     if (user.role !== 'restaurant') {
//       return res.status(403).json({ message: 'Unauthorized Access' });
//     }

//     // Find the restaurant linked to the user
//     const restaurant = await Restaurant.findOne({ user: user._id });
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Fetch orders with populated `menuItem` and filter for the restaurant
//     const orders = await Order.find({
//       'restaurant.restaurantid': restaurant._id,
//       'restaurant.status': { $ne: 'Delivered' },
//     })
//       .populate('restaurant.restaurantid', 'name address')
//       .populate({
//         path: 'items.menuItem',
//         model: 'Menu', // Explicitly populate items from the `Menu` collection
//         select: 'name price restaurant', // Include necessary fields
//       })
//       .populate({
//         path: 'items.menuItem',
//         model: 'SpecialDish', // Explicitly populate items from the `SpecialDish` collection
//         select: 'name price restaurant', // Include necessary fields
//       });

//     // Filter and format orders
//     const formattedOrders = orders.map((order) => {
//       // Filter items to include only those belonging to this restaurant
//       const filteredItems = order.items.filter((item) => {
//         const menuItemRestaurant = item?.menuItem?.restaurant?.toString();
//         return menuItemRestaurant === restaurant._id.toString();
//       });

//       // Calculate the total cost for filtered items
//       const totalCost = filteredItems.reduce((sum, item) => {
//         const price = item?.menuItem?.price || 0;
//         return sum + price * item.quantity;
//       }, 0);

//       return {
//         orderid: order._id,
//         customerName: order.shippingDetails.name,
//         deliveryAddress: order.shippingDetails.address,
//         orderTime: order.createdAt,
//         totalCost,
//         status: order.restaurant[0]?.status || 'Unknown',
//         menuItems: filteredItems.map((item) => ({
//           name: item?.menuItem?.name || 'Unknown Item',
//           quantity: item.quantity,
//         })),
//       };
//     });

//     // Return formatted orders
//     res.status(200).json(formattedOrders);
//   } catch (error) {
//     console.error('Error fetching order details:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// export const getOrderRestaurant = async (req, res) => {
//   try {
//     const token = req.headers.token;

//     if (!token) {
//       return res.status(403).json({ message: 'Please login to access' });
//     }

//     // Verify JWT
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decodedData._id);

//     if (!user || user.role !== 'restaurant') {
//       return res.status(403).json({ message: 'Unauthorized Access' });
//     }

//     // Find the restaurant linked to the user
//     const restaurant = await Restaurant.findOne({ user: user._id });
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Aggregate query to fetch orders
//     const orders = await Order.aggregate([
//       {
//         $match: {
//           'restaurant.restaurantid': restaurant._id,
//           'restaurant.status': { $ne: 'Delivered' },
//         },
//       },
//       {
//         $lookup: {
//           from: 'menus',
//           localField: 'items.menuItem',
//           foreignField: '_id',
//           as: 'menuItemsDetails',
//         },
//       },
//       {
//         $lookup: {
//           from: 'specialdishes',
//           localField: 'items.menuItem',
//           foreignField: '_id',
//           as: 'specialDishDetails',
//         },
//       },
//       {
//         $addFields: {
//           combinedItems: {
//             $concatArrays: ['$menuItemsDetails', '$specialDishDetails'],
//           },
//         },
//       },
//     ]);

//     // Process and format the data
//     const formattedOrders = orders.map((order) => {
//       // Extract restaurant status safely
//       const restaurantStatus = order.restaurant?.find(
//         (r) => r.restaurantid.toString() === restaurant._id.toString()
//       )?.status || 'Unknown';

//       const filteredItems = order.combinedItems.filter(
//         (item) => item?.restaurant?.toString() === restaurant._id.toString()
//       );

//       const totalCost = filteredItems.reduce((sum, item) => {
//         const quantity = order.items.find(
//           (i) => i.menuItem.toString() === item._id.toString()
//         )?.quantity;
//         return sum + (item.price || 0) * (quantity || 0);
//       }, 0);

//       return {
//         orderid: order._id,
//         customerName: order.shippingDetails.name,
//         deliveryAddress: order.shippingDetails.address,
//         orderTime: order.createdAt,
//         totalCost,
//         status: restaurantStatus,
//         menuItems: filteredItems.map((item) => ({
//           name: item.name,
//           price: item.price,
//           quantity: order.items.find(
//             (i) => i.menuItem.toString() === item._id.toString()
//           )?.quantity,
//           type: item.type || (item.from === 'menus' ? 'Menu' : 'SpecialDish'),
//         })),
//       };
//     });

//     // Send the response
//     res.status(200).json(formattedOrders);
//   } catch (error) {
//     console.error('Error fetching order details:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


// export const getDOrderRestaurant = async (req, res) => {
//   try {
//     const token = req.headers.token;

//     if (!token) {
//       return res.status(403).json({ message: 'Please login to access' });
//     }

//     // Verify JWT
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decodedData._id);

//     if (!user || user.role !== 'restaurant') {
//       return res.status(403).json({ message: 'Unauthorized Access' });
//     }

//     // Find the restaurant linked to the user
//     const restaurant = await Restaurant.findOne({ user: user._id });
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Aggregate query to fetch orders
//     const orders = await Order.aggregate([
//       {
//         $match: {
//           'restaurant.restaurantid': restaurant._id,
//           'restaurant.status':'Delivered',
//         },
//       },
//       {
//         $lookup: {
//           from: 'menus',
//           localField: 'items.menuItem',
//           foreignField: '_id',
//           as: 'menuItemsDetails',
//         },
//       },
//       {
//         $lookup: {
//           from: 'specialdishes',
//           localField: 'items.menuItem',
//           foreignField: '_id',
//           as: 'specialDishDetails',
//         },
//       },
//       {
//         $addFields: {
//           combinedItems: {
//             $concatArrays: ['$menuItemsDetails', '$specialDishDetails'],
//           },
//         },
//       },
//     ]);

//     // Process and format the data
//     const formattedOrders = orders.map((order) => {
//       // Extract restaurant status safely
//       const restaurantStatus = order.restaurant?.find(
//         (r) => r.restaurantid.toString() === restaurant._id.toString()
//       )?.status || 'Unknown';

//       const filteredItems = order.combinedItems.filter(
//         (item) => item?.restaurant?.toString() === restaurant._id.toString()
//       );

//       const totalCost = filteredItems.reduce((sum, item) => {
//         const quantity = order.items.find(
//           (i) => i.menuItem.toString() === item._id.toString()
//         )?.quantity;
//         return sum + (item.price || 0) * (quantity || 0);
//       }, 0);

//       return {
//         orderid: order._id,
//         customerName: order.shippingDetails.name,
//         deliveryAddress: order.shippingDetails.address,
//         orderTime: order.createdAt,
//         totalCost,
//         status: restaurantStatus,
//         menuItems: filteredItems.map((item) => ({
//           name: item.name,
//           price: item.price,
//           quantity: order.items.find(
//             (i) => i.menuItem.toString() === item._id.toString()
//           )?.quantity,
//           type: item.type || (item.from === 'menus' ? 'Menu' : 'SpecialDish'),
//         })),
//       };
//     });

//     // Send the response
//     res.status(200).json(formattedOrders);
//   } catch (error) {
//     console.error('Error fetching order details:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

export const getOrderRestaurant = async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({ message: 'Please login to access' });
    }

    // Verify JWT
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData._id);

    if (!user || user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Unauthorized Access' });
    }

    // Find the restaurant linked to the user
    const restaurant = await Restaurant.findOne({ user: user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Aggregate query to fetch orders
    const orders = await Order.aggregate([
      {
        $match: {
          'restaurant.restaurantid': restaurant._id,
        },
      },
      {
        $lookup: {
          from: 'menus',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItemsDetails',
        },
      },
      {
        $lookup: {
          from: 'specialdishes',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'specialDishDetails',
        },
      },
      {
        $addFields: {
          combinedItems: {
            $concatArrays: ['$menuItemsDetails', '$specialDishDetails'],
          },
        },
      },
    ]);

    // Process and format the data
    const formattedOrders = orders
      .map((order) => {
        // Extract restaurant-specific status
        const restaurantStatus = order.restaurant?.find(
          (r) => r.restaurantid.toString() === restaurant._id.toString()
        )?.status;

        // Skip orders where the status is "Delivered"
        if (restaurantStatus === 'Delivered') {
          return null;
        }

        // Filter items specific to this restaurant
        const filteredItems = order.combinedItems.filter(
          (item) => item?.restaurant?.toString() === restaurant._id.toString()
        );

        const totalCost = filteredItems.reduce((sum, item) => {
          const quantity = order.items.find(
            (i) => i.menuItem.toString() === item._id.toString()
          )?.quantity;
          return sum + (item.price || 0) * (quantity || 0);
        }, 0);

        return {
          orderid: order._id,
          customerName: order.shippingDetails.name,
          deliveryAddress: order.shippingDetails.address,
          orderTime: order.createdAt,
          totalCost,
          status: restaurantStatus,
          menuItems: filteredItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: order.items.find(
              (i) => i.menuItem.toString() === item._id.toString()
            )?.quantity,
            type: item.type || (item.from === 'menus' ? 'Menu' : 'SpecialDish'),
          })),
        };
      })
      .filter((order) => order !== null); // Remove null values from skipped orders

    // Send the response
    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getDOrderRestaurant = async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({ message: 'Please login to access' });
    }

    // Verify JWT
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData._id);

    if (!user || user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Unauthorized Access' });
    }

    // Find the restaurant linked to the user
    const restaurant = await Restaurant.findOne({ user: user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Aggregate query to fetch orders
    const orders = await Order.aggregate([
      {
        $match: {
          'restaurant.restaurantid': restaurant._id,
          'restaurant.status': 'Delivered',
        },
      },
      {
        $lookup: {
          from: 'menus',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItemsDetails',
        },
      },
      {
        $lookup: {
          from: 'specialdishes',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'specialDishDetails',
        },
      },
      {
        $addFields: {
          combinedItems: {
            $concatArrays: ['$menuItemsDetails', '$specialDishDetails'],
          },
        },
      },
    ]);

    // Process and format the data
    const formattedOrders = orders
      .map((order) => {
        // Extract restaurant-specific status
        const restaurantStatus = order.restaurant?.find(
          (r) => r.restaurantid.toString() === restaurant._id.toString()
        )?.status;

        // Skip orders where this restaurant's status is not "Delivered"
        if (restaurantStatus !== 'Delivered') {
          return null;
        }

        // Filter items specific to this restaurant
        const filteredItems = order.combinedItems.filter(
          (item) => item?.restaurant?.toString() === restaurant._id.toString()
        );

        const totalCost = filteredItems.reduce((sum, item) => {
          const quantity = order.items.find(
            (i) => i.menuItem.toString() === item._id.toString()
          )?.quantity;
          return sum + (item.price || 0) * (quantity || 0);
        }, 0);

        return {
          orderid: order._id,
          customerName: order.shippingDetails.name,
          deliveryAddress: order.shippingDetails.address,
          orderTime: order.createdAt,
          totalCost,
          status: restaurantStatus,
          menuItems: filteredItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: order.items.find(
              (i) => i.menuItem.toString() === item._id.toString()
            )?.quantity,
            type: item.type || (item.from === 'menus' ? 'Menu' : 'SpecialDish'),
          })),
        };
      })
      .filter((order) => order !== null); // Remove null values from skipped orders

    // Send the response
    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// export const getDOrderRestaurant = async (req, res) => {
//   try {
//     const token = req.headers.token;

//     if (!token) {
//       return res.status(403).json({ message: 'Please login to access' });
//     }

//     // Verify JWT
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decodedData._id);

//     if (user.role !== 'restaurant') {
//       return res.status(403).json({ message: 'Unauthorized Access' });
//     }

//     // Find the restaurant linked to the user
//     const restaurant = await Restaurant.findOne({ user: user._id });
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Fetch orders with populated `menuItem` and filter for the restaurant
//     const orders = await Order.find({
//       'restaurant.restaurantid': restaurant._id,
//       'restaurant.status':  'Delivered' ,
//     })
//       .populate('restaurant.restaurantid', 'name address')
//       .populate({
//         path: 'items.menuItem',
//         model: 'Menu', // Explicitly populate items from the `Menu` collection
//         select: 'name price restaurant', // Include necessary fields
//       })
//       .populate({
//         path: 'items.menuItem',
//         model: 'SpecialDish', // Explicitly populate items from the `SpecialDish` collection
//         select: 'name price restaurant', // Include necessary fields
//       });

//     // Filter orders to only include items from the restaurant's menu
//     const formattedOrders = orders.map((order) => {
//       const filteredItems = order.items.filter((item) => {
//         return item?.menuItem?.restaurant?.toString() === restaurant._id.toString();
//       });

//       const totalCost = filteredItems.reduce((sum, item) => {
//         const price = item?.menuItem?.price || 0;
//         return sum + price * item.quantity;
//       }, 0);

//       return {
//         orderid: order._id,
//         customerName: order.shippingDetails.name,
//         deliveryAddress: order.shippingDetails.address,
//         orderTime: order.createdAt,
//         totalCost,
//         status: order.restaurant[0]?.status || 'Unknown',
//         menuItems: filteredItems.map((item) => ({
//           name: item?.menuItem?.name || 'Unknown Item',
//           quantity: item.quantity,
//         })),
//       };
//     });

//     // Return formatted orders
//     res.status(200).json(formattedOrders);
//   } catch (error) {
//     console.error('Error fetching order details:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// export const updateStatusRestaurant = async (req, res) => {
//   try {
//     const token = req.headers.token;

//     if (!token) {
//       return res.status(403).json({ message: 'Please login to access' });
//     }

//     // Verify JWT
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decodedData._id);

//     if (user.role !== 'restaurant') {
//       return res.status(403).json({ message: 'Unauthorized Access' });
//     }

//     // Find the restaurant linked to the user
//     const restaurant = await Restaurant.findOne({ user: user._id });
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     const { orderId, status } = req.body;

//     if (!orderId || !status) {
//       return res.status(400).json({ message: 'Order ID and status are required' });
//     }

//     // Validate status
//     const validStatuses = ['Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
//     }

//     // Find the order linked to the restaurant
//     const order = await Order.findOne({
//       _id: new mongoose.Types.ObjectId(orderId), // Corrected line
//       'restaurant.restaurantid': restaurant._id,
//     });

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found for this restaurant.' });
//     }

//     // Update the status of the order for the restaurant
//     const restaurantOrderIndex = order.restaurant.findIndex(
//       (r) => r.restaurantid.toString() === restaurant._id.toString()
//     );

//     if (restaurantOrderIndex === -1) {
//       return res.status(403).json({ message: 'Unauthorized to update this order.' });
//     }

//     order.restaurant[restaurantOrderIndex].status = status;

//     // Check if all restaurants in this order have the status "Delivered"
//     const allDelivered = order.restaurant.every((r) => r.status === 'Delivered');

//     if (allDelivered) {
//       // If all restaurants' statuses are "Delivered", update the order status to "Delivered"
//       order.orderStatus = 'Delivered';
//     }

//     await order.save();

//     res.status(200).json({ message: 'Order status updated successfully', order });
//   } catch (error) {
//     console.error('Error updating order status:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// export const updateStatusRestaurant = async (req, res) => {
//   try {
//     const token = req.headers.token;

//     if (!token) {
//       return res.status(403).json({ message: 'Please login to access' });
//     }

//     // Verify JWT
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decodedData._id);

//     if (user.role !== 'restaurant') {
//       return res.status(403).json({ message: 'Unauthorized Access' });
//     }

//     // Find the restaurant linked to the user
//     const restaurant = await Restaurant.findOne({ user: user._id });
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     const { orderId, status } = req.body;

//     if (!orderId || !status) {
//       return res.status(400).json({ message: 'Order ID and status are required' });
//     }

//     // Validate status
//     const validStatuses = ['Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
//     }

//     // Find the order linked to the restaurant
//     const order = await Order.findOne({
//       _id: new mongoose.Types.ObjectId(orderId), // Corrected line
//       'restaurant.restaurantid': restaurant._id,
//     });

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found for this restaurant.' });
//     }

//     // Update the status of the order for the restaurant
//     const restaurantOrderIndex = order.restaurant.findIndex(
//       (r) => r.restaurantid.toString() === restaurant._id.toString()
//     );

//     if (restaurantOrderIndex === -1) {
//       return res.status(403).json({ message: 'Unauthorized to update this order.' });
//     }

//     order.restaurant[restaurantOrderIndex].status = status;

//     // Check if all restaurants in this order have the status "Delivered"
//     const allDelivered = order.restaurant.every((r) => r.status === 'Delivered');

//     if (allDelivered) {
//       // If all restaurants' statuses are "Delivered", update the order status to "Delivered"
//       order.orderStatus = 'Delivered';

//       // Reduce quantities in Menu and SpecialDish models
//       for (const item of order.items) {
//         const { menuItem, quantity } = item;

//         // Update Menu model
//         const menu = await Menu.findById(menuItem);
//         if (menu) {
//           menu.quantity = Math.max(0, menu.quantity - quantity);
//           await menu.save();
//         }

//         // Update SpecialDish model
//         const specialDish = await SpecialDish.findById(menuItem);
//         if (specialDish) {
//           specialDish.quantity = Math.max(0, specialDish.quantity - quantity);
//           await specialDish.save();
//         }
//       }
//     }

//     await order.save();

//     res.status(200).json({ message: 'Order status updated successfully', order });
//   } catch (error) {
//     console.error('Error updating order status:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

export const updateStatusRestaurant = async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({ message: 'Please login to access' });
    }

    // Verify JWT
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData._id);

    if (!user || user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Unauthorized Access' });
    }

    // Find the restaurant linked to the user
    const restaurant = await Restaurant.findOne({ user: user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status are required' });
    }

    // Validate status
    const validStatuses = ['Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
    }

    // Find the order linked to the restaurant
    const order = await Order.findOne({
      _id: orderId,
      'restaurant.restaurantid': restaurant._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found for this restaurant.' });
    }

    // Update the status of the order for the restaurant
    const restaurantOrderIndex = order.restaurant.findIndex(
      (r) => r.restaurantid.toString() === restaurant._id.toString()
    );

    if (restaurantOrderIndex === -1) {
      return res.status(403).json({ message: 'Unauthorized to update this order.' });
    }

    // Update the specific restaurant's status
    order.restaurant[restaurantOrderIndex].status = status;

    // Check if all restaurant statuses in the order are "Delivered"
    const allDelivered = order.restaurant.every((r) => r.status === 'Delivered');

    if (allDelivered) {
      // If all restaurant statuses are "Delivered", update the overall order status
      order.orderStatus = 'Delivered';

      // Reduce quantities in Menu and SpecialDish models
      for (const item of order.items) {
        const { menuItem, quantity } = item;

        // Update Menu model
        const menu = await Menu.findById(menuItem);
        if (menu) {
          menu.quantity = Math.max(0, menu.quantity - quantity);
          await menu.save();
        }

        // Update SpecialDish model
        const specialDish = await SpecialDish.findById(menuItem);
        if (specialDish) {
          specialDish.quantity = Math.max(0, specialDish.quantity - quantity);
          await specialDish.save();
        }
      }
    }

    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      orderStatus: order.orderStatus,
      restaurantStatuses: order.restaurant.map((r) => ({
        restaurantid: r.restaurantid,
        status: r.status,
      })),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    // Fetch the user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { id } = req.body; // Extract the order ID from the request body

    if (!id) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    // Find the order by ID
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Remove the order from the corresponding restaurant's orders array
    const restaurantId = order.restaurant; // Assuming `order.restaurant` contains the associated restaurant's ID
    await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $pull: { orders: id } }, // Remove the order ID from the restaurant's orders array
      { new: true }
    );

    // Delete the order
    const deletedOrder = await Order.findByIdAndDelete(id);

    res.status(200).json({
      message: "Order deleted successfully.",
      deletedOrder, // Optionally return the deleted order details
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error. Unable to delete order." });
  }
};

// Update order status (for restaurant to update order stages)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update status if it's valid
    order.orderStatus = orderStatus;
    await order.save();
    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order status", error: error.message });
  }
};

// Get an order by ID (for user to view specific order details)
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('user', 'username email')
      .populate('restaurant', 'name email')
      .populate('items.menuItem', 'name price'); // Populate menu items

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve order", error: error.message });
  }
};

// Get user's order history (for user to view past orders)
export const getUserOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 }); // Order by most recent

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve order history", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Fetch all orders
    const orders = await Order.find()
      .populate("user", "username email phoneNo") // Populate user details
      .populate("restaurant.restaurantid", "name address") // Populate restaurant details
      .populate("items.menuItem", "name price") // Populate menu item details
      .skip(skip)
      .limit(limit)
      .exec();

    // Count total number of restaurants
    const total = await Order.countDocuments();

    // Return orders
    res.status(200).json(
      {total,            // Total number of restaurants
      page,             // Current page
      pages: Math.ceil(total / limit), // Total pages
      orders});
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};