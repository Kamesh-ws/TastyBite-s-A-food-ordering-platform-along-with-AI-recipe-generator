import express from "express";
import { uploadFiles } from "../middleware/multer.js";
import { createRestaurant, deleteMenu, editRestaurant, getMenu, getAvailableMenus, getMenusByCuisine, getMenuByRestaurantId, getOfferMenu, getRestaurant, getSingleMenu, getSingleRestaurant, myRestaurant, newMenu, updateMenu, createReview, searchMenusAndRestaurants, createSpecialDish, getSpecialDishes, deleteSpecialDish, updateSpecialDish, getSingleSplMenu, getAllMenus, getAllRestaurants, getSpecial, deleteReviewName  } from "../controllers/restaurantController.js";
import { isAuth } from "../middleware/isAuth.js";


const router = express.Router();

router.post("/restaurant/new/:id", uploadFiles ,createRestaurant);
router.get('/restaurant/menus', isAuth, getMenuByRestaurantId);
router.get('/available', getAvailableMenus);
router.get("/restaurant/profile", isAuth, myRestaurant);
router.put("/restaurant/profile", isAuth ,editRestaurant);
router.post("/restaurant/menu/new", uploadFiles ,newMenu);
router.put("/restaurant/menu/:id", isAuth, uploadFiles , updateMenu);
router.delete("/restaurant/menu/:id", isAuth, deleteMenu);
router.get("/restaurant/menu/:id", getSingleMenu);
router.get("/restaurant/:id", getSingleRestaurant);
router.get("/restaurant/menu", isAuth, getMenu);
router.get("/menus", getMenu);
router.get("/search", searchMenusAndRestaurants);
router.get("/restaurants", getRestaurant);
router.get('/menus/offers', getOfferMenu);
router.get('/menus/cuisine/:cuisine', getMenusByCuisine);
router.post('/menu/review', isAuth, createReview);
router.get("/menu/all", getAllMenus); 
router.get("/rest/all", getAllRestaurants);

router.post('/special-dish', isAuth, uploadFiles , createSpecialDish);
router.put('/special-dish/:id',  isAuth, uploadFiles , updateSpecialDish);
router.get('/special-dishes',isAuth, getSpecialDishes);
router.get('/special', getSpecial);
router.get("/restaurant/splmenu/:id", getSingleSplMenu);
router.delete('/menu/review/:menuId', isAuth, deleteReviewName);
router.delete('/special-dish/:id', isAuth, deleteSpecialDish);

export default router;