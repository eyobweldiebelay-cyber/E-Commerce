const orderService = require('../services/orderService');


// Customer creates order
const createOrder = async (req, res) => {

    try {

        const {
            name,
            phone,
            address
        } = req.body;


        if (!name || !phone || !address) {
            return res.status(400).json({
                message: 'Name, phone and address are required'
            });
        }


        const result = await orderService.createOrder(
            req.user.user_id,
            name,
            phone,
            address
        );


        res.status(201).json(result);


    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// Customer orders
const getMyOrders = async (req, res) => {

    try {

        const result =
            await orderService.getMyOrders(
                req.user.user_id
            );

        res.json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// Customer order details
const getOrderById = async (req, res) => {

    try {

        const result =
            await orderService.getOrderById(
                req.user.user_id,
                req.params.id
            );

        res.json(result);

    } catch (error) {

        res.status(404).json({
            message: error.message
        });
    }
};


// Customer cancel
const cancelOrder = async (req, res) => {

    try {

        const result =
            await orderService.cancelOrder(
                req.user.user_id,
                req.params.id
            );

        res.json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// ADMIN: all orders
const getAllOrders = async (req, res) => {

    try {

        const result =
            await orderService.getAllOrders();

        res.json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// ADMIN: update status
const updateOrderStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const result =
            await orderService.updateOrderStatus(
                req.params.id,
                status
            );

        res.json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
};