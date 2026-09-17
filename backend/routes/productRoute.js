const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', productController.getProducts);

router.get('/:id', productController.getProduct);

router.post(
    '/',
    authMiddleware,
    upload.single('image'),
    productController.createProduct
);

router.put(
    '/:id',
    authMiddleware,
    upload.single('image'),
    productController.updateProduct
);

router.delete(
    '/:id',
    authMiddleware,
    productController.deleteProduct
);

module.exports = router;