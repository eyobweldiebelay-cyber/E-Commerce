const express = require('express');

const router = express.Router();

const paymentController =
    require('../controllers/paymentController');

const authMiddleware =
    require('../middleware/authMiddleware');

const adminMiddleware =
    require('../middleware/adminMiddleware');


// CUSTOMER

router.post(
    '/',
    authMiddleware,
    paymentController.createPayment
);


router.post(
    '/verify',
    authMiddleware,
    paymentController.verifyOTP
);


router.get(
    '/order/:orderId',
    authMiddleware,
    paymentController.getPaymentByOrder
);


// ADMIN

router.get(
    '/admin/all',
    authMiddleware,
    adminMiddleware,
    paymentController.getAllPayments
);


module.exports = router;