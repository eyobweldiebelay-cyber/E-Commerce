const paymentService =
    require('../services/paymentService');


// Create payment
const createPayment = async (req, res) => {

    try {

        const {
            orderId,
            method
        } = req.body;


        if (!orderId || !method) {
            return res.status(400).json({
                message:
                    'Order ID and payment method are required'
            });
        }


        const result =
            await paymentService.createPayment(
                req.user.user_id,
                orderId,
                method
            );


        res.status(201).json(result);


    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// Verify OTP
const verifyOTP = async (req, res) => {

    try {

        const {
            paymentId,
            otp
        } = req.body;


        if (!paymentId || !otp) {
            return res.status(400).json({
                message:
                    'Payment ID and OTP are required'
            });
        }


        const result =
            await paymentService.verifyOTP(
                req.user.user_id,
                paymentId,
                otp
            );


        res.json(result);


    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// Get payment for order
const getPaymentByOrder = async (req, res) => {

    try {

        const result =
            await paymentService.getPaymentByOrder(
                req.user.user_id,
                req.params.orderId
            );


        res.json(result);


    } catch (error) {

        res.status(404).json({
            message: error.message
        });
    }
};


// ADMIN
const getAllPayments = async (req, res) => {

    try {

        const result =
            await paymentService.getAllPayments();

        res.json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createPayment,
    verifyOTP,
    getPaymentByOrder,
    getAllPayments
};