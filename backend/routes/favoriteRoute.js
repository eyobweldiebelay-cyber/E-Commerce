const express = require('express');

const router = express.Router();

const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');


router.get(
    '/',
    authMiddleware,
    favoriteController.getFavorites
);


router.post(
    '/',
    authMiddleware,
    favoriteController.addFavorite
);


router.delete(
    '/:productId',
    authMiddleware,
    favoriteController.removeFavorite
);


router.get(
    '/check/:productId',
    authMiddleware,
    favoriteController.checkFavorite
);


module.exports = router;