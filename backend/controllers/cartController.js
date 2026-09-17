const cartService = require('../services/cartService');

const getCart = async (req, res) => {
    try {
        const result = await cartService.getCart(req.user.user_id);

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const addToCart = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        const result = await cartService.addToCart(
            req.user.user_id,
            productId,
            quantity
        );

        res.status(201).json(result);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


const updateCart = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        const result = await cartService.updateCart(
            req.user.user_id,
            productId,
            quantity
        );

        res.json(result);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


const removeFromCart = async (req, res) => {
    try {

        const result = await cartService.removeFromCart(
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


const clearCart = async (req, res) => {
    try {

        const result = await cartService.clearCart(
            req.user.user_id
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart
};