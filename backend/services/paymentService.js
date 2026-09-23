const db = require('../config/db');


// Create payment
const createPayment = async (
    userId,
    orderId,
    method
) => {

    const allowedMethods = [
        'telebirr',
        'cbe',
        'test'
    ];


    if (!allowedMethods.includes(method)) {
        throw new Error('Invalid payment method');
    }


    // Check order
    const [orders] = await db.query(`
        SELECT *
        FROM orders
        WHERE id = ?
        AND user_id = ?
    `, [orderId, userId]);


    if (orders.length === 0) {
        throw new Error('Order not found');
    }


    const order = orders[0];


    if (order.status === 'cancelled') {
        throw new Error(
            'Cannot pay for cancelled order'
        );
    }


    // Check existing payment
    const [payments] = await db.query(`
        SELECT *
        FROM payments
        WHERE order_id = ?
    `, [orderId]);


    if (payments.length > 0) {

        if (payments[0].status === 'paid') {
            throw new Error(
                'Order has already been paid'
            );
        }

        throw new Error(
            'Payment already exists for this order'
        );
    }


    // Create payment
    const [result] = await db.query(`
        INSERT INTO payments
        (
            order_id,
            method,
            amount,
            status
        )
        VALUES (?, ?, ?, 'pending')
    `, [
        orderId,
        method,
        order.total
    ]);


    const paymentId = result.insertId;


    // Generate OTP
    const otp =
        Math.floor(
            100000 + Math.random() * 900000
        ).toString();


    // For development/testing
    // OTP expires in 5 minutes
    await db.query(`
        INSERT INTO payment_otps
        (
            payment_id,
            phone,
            otp,
            expires_at
        )
        VALUES (
            ?,
            ?,
            ?,
            DATE_ADD(NOW(), INTERVAL 5 MINUTE)
        )
    `, [
        paymentId,
        order.phone,
        otp
    ]);


    return {
        paymentId,
        orderId,
        amount: order.total,
        method,
        message: 'OTP sent successfully',

        // Remove this when real SMS service is connected
        testOtp: otp
    };
};


// Verify OTP
const verifyOTP = async (
    userId,
    paymentId,
    otp
) => {

    // Find payment
    const [payments] = await db.query(`
        SELECT
            p.*,
            o.user_id,
            o.id AS order_id
        FROM payments p
        JOIN orders o
            ON p.order_id = o.id
        WHERE p.id = ?
        AND o.user_id = ?
    `, [
        paymentId,
        userId
    ]);


    if (payments.length === 0) {
        throw new Error('Payment not found');
    }


    const payment = payments[0];


    if (payment.status === 'paid') {
        throw new Error(
            'Payment already completed'
        );
    }


    // Find valid OTP
    const [otpRows] = await db.query(`
        SELECT *
        FROM payment_otps
        WHERE payment_id = ?
        AND otp = ?
        AND verified = FALSE
        AND expires_at > NOW()
        ORDER BY id DESC
        LIMIT 1
    `, [
        paymentId,
        otp
    ]);


    if (otpRows.length === 0) {
        throw new Error(
            'Invalid or expired OTP'
        );
    }


    // Mark OTP verified
    await db.query(`
        UPDATE payment_otps
        SET verified = TRUE
        WHERE id = ?
    `, [
        otpRows[0].id
    ]);


    // Transaction ID
    const transactionId =
        `TEST-${Date.now()}`;


    // Payment paid
    await db.query(`
        UPDATE payments
        SET
            status = 'paid',
            transaction_id = ?,
            paid_at = NOW()
        WHERE id = ?
    `, [
        transactionId,
        paymentId
    ]);


    // Order processing
    await db.query(`
        UPDATE orders
        SET status = 'processing'
        WHERE id = ?
    `, [
        payment.order_id
    ]);


    return {
        message: 'Payment successful',
        paymentId,
        orderId: payment.order_id,
        status: 'paid',
        orderStatus: 'processing',
        transactionId
    };
};


// Get payment
const getPaymentByOrder = async (
    userId,
    orderId
) => {

    const [rows] = await db.query(`
        SELECT
            p.id,
            p.order_id,
            p.method,
            p.amount,
            p.status,
            p.transaction_id,
            p.paid_at
        FROM payments p
        JOIN orders o
            ON p.order_id = o.id
        WHERE p.order_id = ?
        AND o.user_id = ?
    `, [
        orderId,
        userId
    ]);


    if (rows.length === 0) {
        throw new Error(
            'Payment not found'
        );
    }


    return rows[0];
};


/// ADMIN: all payments
const getAllPayments = async () => {

    const [rows] = await db.query(`
        SELECT
            p.id,
            p.order_id,
            u.name AS customer_name,
            p.method,
            p.amount,
            p.status,
            p.transaction_id,
            p.paid_at,
            p.paid_at
        FROM payments p
        JOIN orders o
            ON p.order_id = o.id
        JOIN users u
            ON o.user_id = u.id
        ORDER BY p.id DESC
    `);

    return rows;
};

module.exports = {
    createPayment,
    verifyOTP,
    getPaymentByOrder,
    getAllPayments
};