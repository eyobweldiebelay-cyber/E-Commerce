const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const upload = require('../middleware/uploadMiddleware');


// =========================
// PUBLIC ROUTES
// =========================

// Get all products
router.get('/', productController.getProducts);

// Get one product
router.get('/:id', productController.getProduct);


// =========================
// ADMIN ROUTES
// =========================

// Create product
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    upload.single('image'),
    productController.createProduct
);


// Update product
router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    upload.single('image'),
    productController.updateProduct
);


// Delete product
router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    productController.deleteProduct
);


module.exports = router;