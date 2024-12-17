import express from 'express';
import { createOrder, updateOrderStatus, getOrderById, getUserOrderHistory, verifyOrder, getOrders, getOrderRestaurant, updateStatusRestaurant, getDOrders, deleteOrder, getDOrderRestaurant, getAllOrders } from '../controllers/orderController.js';
import { isAuth } from "../middleware/isAuth.js";
import { createCheckoutSession } from '../controllers/paymentController.js';

const router = express.Router();

// Order routes
router.post('/order/create', isAuth,createOrder);
router.post('/orders/verify', isAuth, verifyOrder)
router.get('/order/view', isAuth, getOrders);
router.get('/order/dview', isAuth, getDOrders);
router.delete('/order/delete',isAuth, deleteOrder);
router.get('/restaurant/order/view', isAuth, getOrderRestaurant);
router.get('/restaurant/dorder/view', isAuth, getDOrderRestaurant);
router.put('/restaurant/order/update-status', isAuth, updateStatusRestaurant);
router.put('/status/:orderId', isAuth,updateOrderStatus);
router.get('/:orderId', getOrderById);
router.get('/history/:userId', isAuth, getUserOrderHistory);
router.get("/order/all", getAllOrders);

export default router;
