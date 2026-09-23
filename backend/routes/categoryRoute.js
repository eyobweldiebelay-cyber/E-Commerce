const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/categoryController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');


// ========================================
// GET ALL CATEGORIES
// ========================================

router.get(
    '/',
    categoryController.getCategories
);


// ========================================
// GET ONE CATEGORY
// ========================================

router.get(
    '/:id',
    categoryController.getCategory
);


// ========================================
// CREATE CATEGORY
// ========================================

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    upload.single('image'),
    categoryController.createCategory
);


// ========================================
// UPDATE CATEGORY
// ========================================

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    upload.single('image'),
    categoryController.updateCategory
);


// ========================================
// DELETE CATEGORY
// ========================================

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    categoryController.deleteCategory
);


module.exports = router;