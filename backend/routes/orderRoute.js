const express = require('express');

const router = express.Router();

const orderController = require('../controllers/orderController');

const authMiddleware =
    require('../middleware/authMiddleware');

const adminMiddleware =
    require('../middleware/adminMiddleware');


// CUSTOMER

router.post(
    '/',
    authMiddleware,
    orderController.createOrder
);

router.get(
    '/',
    authMiddleware,
    orderController.getMyOrders
);

router.get(
    '/:id',
    authMiddleware,
    orderController.getOrderById
);

router.put(
    '/:id/cancel',
    authMiddleware,
    orderController.cancelOrder
);


// ADMIN

router.get(
    '/admin/all',
    authMiddleware,
    adminMiddleware,
    orderController.getAllOrders
);

router.put(
    '/admin/:id/status',
    authMiddleware,
    adminMiddleware,
    orderController.updateOrderStatus
);


module.exports = router;