import { Menu } from '../models/menu.js';
import { Restaurant } from '../models/restaurant.js';
import { User } from '../models/user.js';
import { SpecialDish } from '../models/SpecialDish.js';
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";

// Create a new restaurant
// export const createRestaurant = async (req, res) => {
//     try {
//         if (req.user.role !== "restaurant") {
//             return res.status(403).json({
//                 message: "Unauthorized Access",
//             });
//         }

//         const userId = req.params.id; // req.user is populated from authentication middleware

//         const existing = await Restaurant.findOne({ user: userId });
//         if (existing) {
//             return res.status(409).json({
//                 message: "Already available",
//             })
//         }

//         // Check if the user exists
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const image = req.file;
//         if (!image) {
//             return res.status(400).json({
//                 message: "please select the image",
//             });
//         }

//         const base64Image = Buffer.from(image.buffer).toString("base64");
//         const dataURI = `data:${image.mimetype};base64,${base64Image}`;
//         const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

//         const { name, email, contact, address, city, state, cuisines, deliveryPrice, deliveryTime } = req.body;

//         const restaurant = await Restaurant.create({
//             user: userId,
//             name,
//             email,
//             phoneNo: contact,
//             address: { address, city, state },
//             cuisines: typeof cuisines === "string" ? JSON.parse(cuisines) : cuisines,
//             deliveryPrice,
//             estimatedDeliveryTime: deliveryTime,
//             image: uploadResponse.url,

//         });

//         res.status(201).json({
//             message: "Restaurant details added success",
//             restaurant,
//         });


//     } catch (err) {
//         return res.status(500).json({
//             message: err.message,
//         });
//     }
// };
export const createRestaurant = async (req, res) => {
    try {
        // Get user ID from request parameters
        const userId = req.params.id;

        // Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user's role is 'restaurant'
        if (user.role !== "restaurant") {
            return res.status(403).json({
                message: "Unauthorized Access",
            });
        }

        // Check if a restaurant already exists for this user
        const existing = await Restaurant.findOne({ user: userId });
        if (existing) {
            return res.status(409).json({
                message: "Restaurant already exists for this user",
            });
        }

        // Check if an image is provided
        const image = req.file;
        if (!image) {
            return res.status(400).json({
                message: "Please select an image",
            });
        }

        // Process and upload the image using Cloudinary
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;
        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        // Destructure the request body
        const { address, city, state, cuisines, deliveryPrice, deliveryTime } = req.body;

        // Create the restaurant document
        const restaurant = await Restaurant.create({
            user: userId,
            name: user.username,
            email: user.email,
            phoneNo: user.phoneNo,
            address: { address, city, state },
            cuisines: typeof cuisines === "string" ? JSON.parse(cuisines) : cuisines,
            deliveryPrice,
            estimatedDeliveryTime: deliveryTime,
            image: uploadResponse.url,
        });

        // Respond with success
        res.status(201).json({
            message: "Restaurant details added successfully",
            restaurant,
        });
    } catch (err) {
        // Handle errors
        return res.status(500).json({
            message: err.message,
        });
    }
};

//search 
export const searchMenusAndRestaurants = async (req, res) => {
    try {
        const {
            location,
            searchName,
            priceRange,
            cuisine,
            rating,
            foodTag,
            offer,
            sortBy,
        } = req.query;

        // Parse priceRange
        const parsedPriceRange = typeof priceRange === 'string'
            ? priceRange.includes('[')
                ? JSON.parse(priceRange)
                : priceRange.split(',').map(Number)
            : [0, 1000];

        // Filters
        const locationFilter = location ? { 'address.city': location } : {};
        const searchRegex = searchName ? { $regex: searchName, $options: 'i' } : null;
        const priceRangeFilter = { price: { $gte: parsedPriceRange[0], $lte: parsedPriceRange[1] } };
        const cuisineFilter = cuisine ? { cuisineType: cuisine } : {};
        const ratingFilter = rating ? { ratings: { $gte: Number(rating) } } : {};
        const foodTagFilter = foodTag ? { foodTag } : {};
        const offerFilter = offer === 'true' ? { offer: { $gt: 0 } } : {};

        // Debugging parsed filters
        console.log('Parsed Filters:', {
            searchName,
            priceRange: parsedPriceRange,
            cuisineFilter,
            ratingFilter,
            foodTagFilter,
            offerFilter,
        });

        // If `searchName` is present, prioritize searching `Restaurant`
        if (searchName) {
            const restaurantResults = await Restaurant.find({
                ...locationFilter,
                name: searchRegex, // Search restaurant by name
            }).sort({ name: 1 }); // Example: sort by name alphabetically

            if (restaurantResults.length > 0) {
                return res.json({
                    type: 'restaurant',
                    results: restaurantResults,
                });
            }
        }

        // If `searchName` is empty or no matching restaurants, search `Menu`
        const menuResults = await Menu.find({
            ...searchRegex ? { name: searchRegex } : {}, // Search menu by name if provided
            ...priceRangeFilter,
            ...cuisineFilter,
            ...ratingFilter,
            ...foodTagFilter,
            ...offerFilter,
        })
            .populate({
                path: 'restaurant',
                match: locationFilter,
                select: 'name address estimatedDeliveryTime',
            }) // Populate restaurant with location filtering
            .sort(
                sortBy === 'price'
                    ? { price: 1 }
                    : sortBy === 'rating'
                        ? { ratings: -1 }
                        : sortBy === 'offer'
                            ? { offer: -1 }
                            : sortBy === 'deliveryTime'
                                ? { 'restaurant.estimatedDeliveryTime': 1 }
                                : {}
            );

        // Filter out menus with invalid or unmatched restaurants
        const filteredMenuResults = menuResults.filter(menu => menu.restaurant);

        if (filteredMenuResults.length > 0) {
            return res.json({
                type: 'menu',
                results: filteredMenuResults,
            });
        }

        // No results found
        return res.json({
            type: 'none',
            message: 'No results found for the given search criteria.',
        });

    } catch (error) {
        console.error('Error in searchMenusAndRestaurants:', error);
        res.status(500).json({ error: 'Error searching for restaurants and menus' });
    }
};

// Fetch single restaurant details
export const getSingleRestaurant = async (req, res) => {
    try {
        // Fetch the restaurant using the ID from the request parameters
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        return res.status(200).json({
            success: true,
            restaurant,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//All restaurant details 
export const getRestaurant = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        if (restaurants.length === 0) {
            return res.status(404).json({
                message: "No restaurants found",
            });
        }
        return res.status(200).json({
            success: true,
            restaurants,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//View restarant Profile
export const myRestaurant = async (req, res) => {
    try {

        const { username, email, phoneNo } = req.user;

        const restaurant = await Restaurant.findOne({ user: req.user._id });

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        restaurant.name = username;
        restaurant.email = email;
        restaurant.phoneNo = phoneNo;

        await restaurant.save();

        return res.status(200).json({
            restaurant,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//Modify restarant Profile
export const editRestaurant = async (req, res) => {
    try {
        // Get user ID from `isAuth` middleware
        const userId = req.user._id;

        // Find the restaurant owned by the logged-in user
        let restaurant = await Restaurant.findOne({ user: userId });

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found for the authenticated user.',
            });
        }

        // Handle image update if a new file is uploaded
        if (req.file) {
            try {
                const image = req.file;
                const base64Image = Buffer.from(image.buffer).toString('base64');
                const dataURI = `data:${image.mimetype};base64,${base64Image}`;
                const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
                req.body.image = uploadResponse.url; // Add the uploaded image URL to req.body
            } catch (uploadError) {
                return res.status(500).json({
                    message: 'Image upload failed.',
                    error: uploadError.message,
                });
            }
        }

        // Define allowed fields for update
        const allowedFields = [
            'name',
            'phoneNo',
            'address',
            'deliveryPrice',
            'estimatedDeliveryTime',
            'cuisines',
            'image',
        ];

        // Validate and update only allowed fields
        allowedFields.forEach((field) => {
            if (req.body[field]) {
                restaurant[field] = req.body[field];
            }
        });

        // Validate nested fields like `address` (if provided)
        if (req.body.address) {
            const { address, city, state } = req.body.address;
            restaurant.address = { address, city, state };
        }

        // Save the updated restaurant document
        const updatedRestaurant = await restaurant.save();

        res.status(200).json({
            message: 'Restaurant updated successfully.',
            restaurant: updatedRestaurant,
        });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({
            message: 'An error occurred while updating the restaurant.',
            error: error.message,
        });
    }
};

export const getMenuByRestaurantId = async (req, res) => {
    try {
        // First, find the restaurant based on the logged-in user's ID
        const restaurant = await Restaurant.findOne({ user: req.user._id });

        // If no restaurant is found for the logged-in user
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user' });
        }

        // Now, find the restaurant by its ID (if passed as a parameter)
        const restaurantById = await Restaurant.findById(restaurant._id).populate('menu');

        // If restaurant by ID is not found (shouldn't happen if the previous step succeeds)
        if (!restaurantById) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Return the populated menu for the restaurant
        return res.status(200).json(restaurantById.menu);

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
}

//Create new menu
export const newMenu = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(403).json({
                message: "Please login to access"
            });
        }

        // Decode the token to get the user ID
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedData._id);


        // Check if the user has the 'restaurant' role
        if (user.role !== "restaurant") {
            return res.status(403).json({
                message: "Unauthorized Access",
            });
        }

        // Find the restaurant associated with the logged-in user
        let restaurant = await Restaurant.findOne({ user: user._id });

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        // Handle the image upload
        const image = req.file;
        if (!image) {
            return res.status(400).json({
                message: "Please select an image",
            });
        }

        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;
        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        // Add the image URL and restaurant ID to req.body
        req.body.image = uploadResponse.url;
        req.body.restaurant = restaurant._id;  // Use the restaurant's _id from the fetched restaurant

        // Create the new menu item
        const menu = await Menu.create(req.body);

        if (!restaurant.cuisines.includes(req.body.cuisineType)) {
            restaurant.cuisines.push(req.body.cuisineType);
        }

        restaurant.menu.push(menu._id);
        await restaurant.save();

        console.log(menu);
        return res.status(201).json({
            success: true,
            menu,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//Modify menu
export const updateMenu = async (req, res) => {
    try {
        let menu = await Menu.findById(req.params.id);

        if (!menu) {
            return res.status(404).json({
                message: 'Menu item not found',
            });
        }

        // Find the restaurant associated with the logged-in user
        let restaurant = await Restaurant.findOne({ user: req.user._id });

        if (!restaurant || String(menu.restaurant) !== String(restaurant._id)) {
            return res.status(403).json({
                message: "Unauthorized Access",
            });
        }

        // Handle image update (if an image file is uploaded)
        if (req.file) {
            const image = req.file;
            const base64Image = Buffer.from(image.buffer).toString('base64');
            const dataURI = `data:${image.mimetype};base64,${base64Image}`;
            const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
            menu.image = uploadResponse.url; // Update image URL
        }

        menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
            new: true,             // Return the newly updated document
            runValidators: true    // Validate data against the schema
        });
        // Save the updated menu item
        await menu.save();

        return res.status(200).json({
            message: 'Menu item updated successfully',
            menu,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//Delete menu
export const deleteMenu = async (req, res) => {
    try {
        // Find the menu item by ID
        let menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({
                message: 'Menu item not found',
            });
        }

        // Find the restaurant associated with the logged-in user
        let restaurant = await Restaurant.findOne({ user: req.user._id });
        if (!restaurant || String(menu.restaurant) !== String(restaurant._id)) {
            return res.status(403).json({
                message: "Unauthorized Access",
            });
        }

        // Delete the menu item using the correct method
        await Menu.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: 'Menu item deleted successfully',
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//View menu
export const getMenu = async (req, res) => {
    try {
        const menus = await Menu.find();

        return res.status(200).json({
            success: true,
            menus,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//offer menu
export const getOfferMenu = async (req, res) => {
    try {
        // Fetch menus that have a non-zero offer
        const menusWithOffers = await Menu.find({ offer: { $gt: 0 } });

        if (menusWithOffers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No offers available at this time"
            });
        }

        res.status(200).json({
            success: true,
            menusWithOffers
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//cuisine view menu
export const getMenusByCuisine = async (req, res) => {
    const { cuisine } = req.params;
    try {
        const validCategories = ['Biryani', 'Pizza', 'South-Indian', 'Burgers', 'Chinese', 'Cakes', 'Shake', 'North-Indian', 'Ice-Cream', 'Pasta', 'Noodles', 'Rolls', 'Salad', 'Sandwich', 'Deserts'];
        if (!validCategories.includes(cuisine)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category provided"
            });
        }

        // Fetch menus by category
        const menus = await Menu.find({ cuisineType: cuisine });

        if (menus.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No menus found for this category"
            });
        }

        res.status(200).json({
            success: true,
            menus
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//View single menu
export const getSingleMenu = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);

        if (!menu) {
            return res.status(404).json({
                message: 'Menu item not found',
            });
        }

        return res.status(200).json({
            success: true,
            menu,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//create review
// export const createReview = async (req, res) => {
//     try {
//         const { menuId, rating, comment } = req.body;

//         // Check if the required data is provided
//         if (!menuId || rating === undefined || !comment) {
//             return res.status(400).json({
//                 message: "Please provide menu ID, rating, and comment.",
//             });
//         }

//         // Validate rating range (e.g., rating must be between 1 and 5)
//         if (rating < 1 || rating > 5) {
//             return res.status(400).json({
//                 message: "Rating must be between 1 and 5.",
//             });
//         }

//         const review = {
//             user: req.user.id,
//             name: req.user.username,
//             rating: Number(rating),
//             comment,
//         };

//         const menu = await Menu.findById(menuId);

//         if (!menu) {
//             return res.status(404).json({
//                 message: "Menu item not found.",
//             });
//         }

//         // Check if the user has already reviewed the menu item
//         const existingReview = menu.reviews.find(
//             (review) => review.user.toString() === req.user.id.toString()
//         );

//         if (existingReview) {
//             // If updating an existing review, recalculate the total rating excluding the old rating
//             const oldRating = existingReview.rating;
//             existingReview.comment = comment;
//             existingReview.rating = Number(rating);

//             // Update average rating with the new rating
//             menu.ratings = parseFloat(((menu.ratings * menu.numOfReviews - oldRating + rating) / menu.numOfReviews).toFixed(2));
//         } else {
//             // Add a new review
//             menu.reviews.push(review);
//             menu.numOfReviews = menu.reviews.length;

//             // Update average rating by including the new rating
//             menu.ratings = parseFloat(((menu.ratings * (menu.numOfReviews - 1) + rating) / menu.numOfReviews).toFixed(2));
//         }

//         // Save the updated menu item
//         await menu.save({ validateBeforeSave: false });

//         res.status(200).json({
//             success: true,
//             message: "Review submitted successfully",
//             ratings: menu.ratings,
//         });
//     } catch (err) {
//         return res.status(500).json({
//             message: err.message,
//         });
//     }
// };
export const createReview = async (req, res) => {
    try {
        const { menuName, rating, comment } = req.body;

        // Validate input
        if (!menuName || rating === undefined || !comment) {
            return res.status(400).json({
                message: "Please provide menu name, rating, and comment.",
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5.",
            });
        }

        const review = {
            user: req.user.id,
            name: req.user.username,
            rating: Number(rating),
            comment,
        };

        // Find menu or special dish
        let menu = await Menu.findOne({ name: menuName });
        let splmenu = null;

        if (!menu) {
            splmenu = await SpecialDish.findOne({ name: menuName });
            if (!splmenu) {
                return res.status(404).json({
                    message: "Menu item or special dish not found.",
                });
            }
        }

        // Determine which collection to update
        const target = menu || splmenu;

        // Check if user has already reviewed
        const existingReview = target.reviews.find(
            (review) => review.user.toString() === req.user.id.toString()
        );

        if (existingReview) {
            // Update existing review
            const oldRating = existingReview.rating;
            existingReview.comment = comment;
            existingReview.rating = Number(rating);

            // Update average rating
            target.ratings = parseFloat(
                ((target.ratings * target.numOfReviews - oldRating + rating) / target.numOfReviews).toFixed(2)
            );
        } else {
            // Add a new review
            target.reviews.push(review);
            target.numOfReviews = target.reviews.length;

            // Update average rating
            target.ratings = parseFloat(
                ((target.ratings * (target.numOfReviews - 1) + rating) / target.numOfReviews).toFixed(2)
            );
        }

        // Save the updated target
        await target.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Review submitted successfully",
            ratings: target.ratings,
            review: target.reviews,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

export const deleteReviewName = async (req, res) => {
    try {
      const { menuId } = req.params;
      const userId = req.user.id;
  
      // Find the menu item by its name
      let menu = await Menu.findOne({ name: menuId });
      let specialMenu = null;
  
      // If not found in Menu, check in SpecialDish
      if (!menu) {
        specialMenu = await SpecialDish.findOne({ name: menuId });
        if (!specialMenu) {
          return res.status(404).json({ message: "Menu item or special dish not found." });
        }
      }
  
      // Determine the collection to update and find the review
      const collection = menu || specialMenu;
      const reviewIndex = collection.reviews.findIndex(
        (review) => review.user.toString() === userId
      );
  
      if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found for this user." });
      }
  
      // Remove the review and update ratings
      const [removedReview] = collection.reviews.splice(reviewIndex, 1);
  
      if (collection.numOfReviews > 1) {
        // Recalculate the average rating excluding the deleted review's rating
        collection.ratings = parseFloat(
          (
            (collection.ratings * collection.numOfReviews - removedReview.rating) /
            (collection.numOfReviews - 1)
          ).toFixed(2)
        );
      } else {
        // If no reviews left, reset ratings and numOfReviews
        collection.ratings = 0;
      }
      collection.numOfReviews = collection.reviews.length;
  
      // Save the updated menu/special menu
      await collection.save();
  
      res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || "Server error",
      });
    }
};
  
export const getUserReviews = async (req, res) => {
    try {
        const { menuName } = req.body;

        if (!menuName) {
            return res.status(400).json({
                message: "Please provide a menu name.",
            });
        }

        // Fetch the menu or special dish
        const menu = await Menu.findOne({ name: menuName }).populate("reviews.user", "username");
        const splmenu = await SpecialDish.findOne({ name: menuName }).populate("reviews.user", "username");

        // If neither exists, return an error
        if (!menu && !splmenu) {
            return res.status(404).json({
                message: "Menu item or special dish not found.",
            });
        }

        // Get user-specific reviews from both models
        const userId = req.user.id; // Assuming `req.user.id` contains the user's ID

        const menuReviews = menu
            ? menu.reviews.filter((review) => review.user.toString() === userId.toString())
            : [];
        const splmenuReviews = splmenu
            ? splmenu.reviews.filter((review) => review.user.toString() === userId.toString())
            : [];

        // Combine results
        const allReviews = [...menuReviews, ...splmenuReviews];

        if (allReviews.length === 0) {
            return res.status(404).json({
                message: "No reviews found for this user on the specified menu or special dish.",
            });
        }

        res.status(200).json({
            success: true,
            reviews: allReviews,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

//List Review
export const getReview = async (req, res) => {
    try {
        const menu = await Menu.findById(req.query.id).populate('reviews.user', 'name email');

        if (!menu) {
            return res.status(404).json({
                message: "Menu item not found.",
            });
        }

        res.status(200).json({
            success: true,
            reviews: menu.reviews
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//Delete review
export const deleteReview = async (req, res) => {
    try {
        const menu = await Menu.findById(req.query.menuId);

        if (!menu) {
            return res.status(404).json({
                message: "Menu item not found.",
            });
        }

        // Filter out the review to be deleted
        const reviews = menu.reviews.filter(review => review._id.toString() !== req.query.id.toString());

        const numOfReviews = reviews.length;

        // Find the new average rating
        let ratings = reviews.reduce((acc, review) => review.rating + acc, 0) / reviews.length;
        ratings = isNaN(ratings) ? 0 : ratings;

        // Update the menu item
        await Menu.findByIdAndUpdate(req.query.menuId, {
            reviews,
            numOfReviews,
            ratings
        });

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};


// Controller to get all available menu items
export const getAvailableMenus = async (req, res) => {
    try {
        // Fetch all menus and filter out the unavailable ones
        const menus = await Menu.find();

        // Filter the menus based on their availability
        const availableMenus = menus.filter(menu => menu.isAvailable());

        // Return the available menu items
        return res.status(200).json({
            success: true,
            availableMenus
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// export const deleteReview = async (req, res) => {
//     try {
//         const menu = await Menu.findById(req.query.menuId);

//         //filtering the reviews which does match the deleting review id
//         const reviews = menu.reviews.filter(review => {
//            return review._id.toString() !== req.query.id.toString()
//         });
//         //number of reviews 
//         const numOfReviews = reviews.length;

//         //finding the average with the filtered reviews
//         let ratings = reviews.reduce((acc, review) => {
//             return review.rating + acc;
//         }, 0) / reviews.length;
//         ratings = isNaN(ratings)?0:ratings;

//         //save the menu document
//         await Menu.findByIdAndUpdate(req.query.menuId, {
//             reviews,
//             numOfReviews,
//             ratings
//         })
//         res.status(200).json({
//             success: true
//         })

//     } catch (err) {
//         return res.status(500).json({
//             message: err.message,
//         });
//     }
// }

//special menu creating
export const createSpecialDish = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(403).json({
                message: "Please login to access"
            });
        }

        // Decode the token to get the user ID
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedData._id);


        // Check if the user has the 'restaurant' role
        if (user.role !== "restaurant") {
            return res.status(403).json({
                message: "Unauthorized Access",
            });
        }

        // Find the restaurant associated with the logged-in user
        let restaurant = await Restaurant.findOne({ user: user._id });

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        // Handle the image upload
        const image = req.file;
        if (!image) {
            return res.status(400).json({
                message: "Please select an image",
            });
        }

        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;
        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        // Add the image URL and restaurant ID to req.body
        req.body.image = uploadResponse.url;
        req.body.restaurant = restaurant._id;  // Use the restaurant's _id from the fetched restaurant

        // Validate request body
        if (!req.body.name || !req.body.price || !req.body.cuisineType) {
            return res.status(400).json({
                message: "Please provide all required fields: name, price, and cuisineType",
            });
        }

        // Create the new menu item
        const specialDish = await SpecialDish.create(req.body);

        restaurant.specialMenu.push(specialDish._id);
        await restaurant.save();

        console.log(specialDish);

        res.status(201).json({
            success: true,
            message: "Special Dish created successfully",
            specialDish
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getSpecialDishes = async (req, res) => {
    try {
        // Find the restaurant associated with the logged-in user
        const restaurant = await Restaurant.findOne({ user: req.user._id }).populate('specialMenu');

        // If no restaurant is found
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found for this user.' });
        }

        // Filter special dishes to check if they are still valid (not expired)
        const currentTime = new Date();
        const dishesWithTimer = restaurant.specialMenu.map((dish) => {
            const expiryTime = new Date(dish.specialDishExpiry);
            const timeRemaining = expiryTime - currentTime;

            // Calculate hours, minutes, and seconds remaining
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            return {
                ...dish._doc, // Include all original fields of the dish
                timer: timeRemaining > 0
                    ? `${hours}h ${minutes}m ${seconds}s` // If not expired, show remaining time
                    : "Expired", // Mark as expired if time has elapsed
            };
        });

        // Filter out expired dishes
        const activeDishes = dishesWithTimer.filter(dish => dish.timer !== "Expired");

        return res.status(200).json({
            success: true,
            specialDishes: activeDishes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSpecial = async (req, res) => {
    try {
        // Find the restaurant associated with the logged-in user
        const restaurant = await SpecialDish.find();

        // Filter special dishes to check if they are still valid (not expired)
        const currentTime = new Date();
        const dishesWithTimer = restaurant.map((dish) => {
            const expiryTime = new Date(dish.specialDishExpiry);
            const timeRemaining = expiryTime - currentTime;

            // Calculate hours, minutes, and seconds remaining
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            return {
                ...dish._doc, // Include all original fields of the dish
                timer: timeRemaining > 0
                    ? `${hours}h ${minutes}m ${seconds}s` // If not expired, show remaining time
                    : "Expired", // Mark as expired if time has elapsed
            };
        });

        // Filter out expired dishes
        const activeDishes = dishesWithTimer.filter(dish => dish.timer !== "Expired");

        return res.status(200).json({
            success: true,
            specialDishes: activeDishes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//View single menu
export const getSingleSplMenu = async (req, res) => {
    try {
        const menu = await SpecialDish.findById(req.params.id);

        if (!menu) {
            return res.status(404).json({
                message: 'Menu item not found',
            });
        }

        return res.status(200).json({
            success: true,
            menu,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

// Delete a specific special dish (manual delete, optional)
export const deleteSpecialDish = async (req, res) => {
    try {
        const { id } = req.params;

        const specialDish = await SpecialDish.findByIdAndDelete(id);

        if (!specialDish) {
            return res.status(404).json({
                success: false,
                message: "Special Dish not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Special Dish deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//update
export const updateSpecialDish = async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(403).json({
                message: "Please login to access",
            });
        }

        // Decode the token to get the user ID
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedData._id);

        // Check if the user has the 'restaurant' role
        if (user.role !== "restaurant") {
            return res.status(403).json({
                message: "Unauthorized Access",
            });
        }

        // Find the restaurant associated with the logged-in user
        const restaurant = await Restaurant.findOne({ user: user._id });

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
            });
        }

        // Check if the special dish exists and belongs to the restaurant
        const { id } = req.params; // Dish ID passed as a parameter
        const specialDish = await SpecialDish.findById(id);

        if (!specialDish || specialDish.restaurant.toString() !== restaurant._id.toString()) {
            return res.status(404).json({
                message: "Special Dish not found or unauthorized to update",
            });
        }

        // Handle image update if provided
        if (req.file) {
            const base64Image = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

            try {
                const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
                req.body.image = uploadResponse.url; // Update the image URL in the request body
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed. Please try again.",
                });
            }
        }

        // Update special dish details
        const updatedSpecialDish = await SpecialDish.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Special Dish updated successfully",
            specialDish: updatedSpecialDish,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllMenus = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit; // Calculate how many documents to skip

        // Fetch all menu items
        const menus = await Menu.find()
            .populate("restaurant", "name address") // Populate restaurant details if needed
            .skip(skip)
            .limit(limit)
            .exec();

        // Count total number of restaurants
        const total = await Menu.countDocuments();

        // Check if no menus exist
        res.status(200).json({
            total,            // Total number of restaurants
            page,             // Current page
            pages: Math.ceil(total / limit), // Total pages
            menus,      // Paginated data
        });
    } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllRestaurants = async (req, res) => {
    try {
        // Extract page and limit from query parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit; // Calculate how many documents to skip

        // Fetch paginated restaurants
        const restaurants = await Restaurant.find()
            .populate("user", "username email phoneNo") // Populate user details
            .populate("menu", "name price cuisineType") // Populate menu items
            .populate("specialMenu", "name price cuisineType") // Populate special menu items
            .skip(skip)
            .limit(limit)
            .exec();

        // Count total number of restaurants
        const total = await Restaurant.countDocuments();

        // Return restaurants and pagination info
        res.status(200).json({
            total,            // Total number of restaurants
            page,             // Current page
            pages: Math.ceil(total / limit), // Total pages
            restaurants,      // Paginated data
        });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

