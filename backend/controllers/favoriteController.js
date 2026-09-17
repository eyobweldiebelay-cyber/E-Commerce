const favoriteService = require('../services/favoriteService');


const getFavorites = async (req, res) => {
    try {

        const result = await favoriteService.getFavorites(
            req.user.user_id
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const addFavorite = async (req, res) => {
    try {

        const { productId } = req.body;

        const result = await favoriteService.addFavorite(
            req.user.user_id,
            productId
        );

        res.status(201).json(result);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


const removeFavorite = async (req, res) => {
    try {

        const result = await favoriteService.removeFavorite(
            req.user.user_id,
            req.params.productId
        );

        res.json(result);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


const checkFavorite = async (req, res) => {
    try {

        const result = await favoriteService.checkFavorite(
            req.user.user_id,
            req.params.productId
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite
};