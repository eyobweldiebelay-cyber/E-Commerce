const express = require('express');

const router = express.Router();

const userController =
    require('../controllers/userController');

const authMiddleware =
    require('../middleware/authMiddleware');

const adminMiddleware =
    require('../middleware/adminMiddleware');


router.get(
    '/customers',
    authMiddleware,
    adminMiddleware,
    userController.getAllCustomers
);


router.get(
    '/customers/:id',
    authMiddleware,
    adminMiddleware,
    userController.getCustomerById
);


module.exports = router;