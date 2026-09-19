const userService = require('../services/userService');

const getAllCustomers = async (req, res) => {
    try {
        const customers = await userService.getAllCustomers();

        res.status(200).json({
            customers
        });

    } catch (error) {
        console.error('Get customers error:', error);

        res.status(500).json({
            message: 'Failed to get customers'
        });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;

        const customer =
            await userService.getCustomerById(customerId);

        res.status(200).json({
            customer
        });

    } catch (error) {
        console.error('Get customer error:', error);

        if (error.message === 'Customer not found') {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        res.status(500).json({
            message: 'Failed to get customer'
        });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById
};