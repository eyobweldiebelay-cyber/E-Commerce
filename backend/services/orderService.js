const db = require('../config/db');


// Create order from cart
const createOrder = async (
    userId,
    name,
    phone,
    address
) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();


        // Get cart items
        const [items] = await connection.query(`
            SELECT
                ci.product_id,
                ci.quantity,
                p.name,
                p.price,
                p.stock
            FROM cart c
            JOIN cart_items ci ON c.id = ci.cart_id
            JOIN products p ON ci.product_id = p.id
            WHERE c.user_id = ?
        `, [userId]);


        if (items.length === 0) {
            throw new Error('Cart is empty');
        }


        let subtotal = 0;


        // Check stock and calculate subtotal
        for (const item of items) {

            if (item.stock < item.quantity) {
                throw new Error(
                    `${item.name} does not have enough stock`
                );
            }

            subtotal +=
                Number(item.price) * Number(item.quantity);
        }


        const deliveryFee = 150;

        const total = subtotal + deliveryFee;


        // Create order
        const [orderResult] = await connection.query(`
            INSERT INTO orders
            (
                user_id,
                subtotal,
                delivery_fee,
                total,
                status,
                name,
                phone,
                address
            )
            VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)
        `, [
            userId,
            subtotal,
            deliveryFee,
            total,
            name,
            phone,
            address
        ]);


        const orderId = orderResult.insertId;


        // Create order items
        for (const item of items) {

            const itemSubtotal =
                Number(item.price) * Number(item.quantity);


            await connection.query(`
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    price,
                    subtotal
                )
                VALUES (?, ?, ?, ?, ?)
            `, [
                orderId,
                item.product_id,
                item.quantity,
                item.price,
                itemSubtotal
            ]);


            // Reduce stock
            await connection.query(`
                UPDATE products
                SET stock = stock - ?
                WHERE id = ?
            `, [
                item.quantity,
                item.product_id
            ]);
        }


        // Clear cart
        await connection.query(`
            DELETE ci
            FROM cart_items ci
            JOIN cart c ON ci.cart_id = c.id
            WHERE c.user_id = ?
        `, [userId]);


        await connection.commit();


        return {
            orderId,
            subtotal,
            deliveryFee,
            total,
            status: 'pending'
        };


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }
};


// Get all customer orders
const getMyOrders = async (userId) => {

    const [orders] = await db.query(`
        SELECT
            id,
            subtotal,
            delivery_fee,
            total,
            status,
            name,
            phone,
            address,
            created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `, [userId]);

    return orders;
};


// Get one order
const getOrderById = async (userId, orderId) => {

    const [orders] = await db.query(`
        SELECT *
        FROM orders
        WHERE id = ?
        AND user_id = ?
    `, [orderId, userId]);


    if (orders.length === 0) {
        throw new Error('Order not found');
    }


    const [items] = await db.query(`
        SELECT
            oi.id,
            oi.product_id,
            p.name,
            p.image,
            oi.quantity,
            oi.price,
            oi.subtotal
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `, [orderId]);


    return {
        order: orders[0],
        items
    };
};


// Cancel order
const cancelOrder = async (userId, orderId) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();


        const [orders] = await connection.query(`
            SELECT *
            FROM orders
            WHERE id = ?
            AND user_id = ?
        `, [orderId, userId]);


        if (orders.length === 0) {
            throw new Error('Order not found');
        }


        const order = orders[0];


        if (
            order.status !== 'pending'
        ) {
            throw new Error(
                'Only pending orders can be cancelled'
            );
        }


        // Get order items
        const [items] = await connection.query(`
            SELECT product_id, quantity
            FROM order_items
            WHERE order_id = ?
        `, [orderId]);


        // Return stock
        for (const item of items) {

            await connection.query(`
                UPDATE products
                SET stock = stock + ?
                WHERE id = ?
            `, [
                item.quantity,
                item.product_id
            ]);
        }


        // Cancel order
        await connection.query(`
            UPDATE orders
            SET status = 'cancelled'
            WHERE id = ?
        `, [orderId]);


        await connection.commit();


        return {
            message: 'Order cancelled'
        };


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }
};


// ADMIN: get all orders
const getAllOrders = async () => {

    const [orders] = await db.query(`
        SELECT
            o.id,
            o.user_id,
            u.name AS customer_name,
            u.email,
            o.subtotal,
            o.delivery_fee,
            o.total,
            o.status,
            o.phone,
            o.address,
            o.created_at
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
    `);

    return orders;
};


// ADMIN: update order status
const updateOrderStatus = async (orderId, status) => {

    const allowedStatuses = [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
    ];


    if (!allowedStatuses.includes(status)) {
        throw new Error('Invalid order status');
    }


    const [result] = await db.query(`
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `, [status, orderId]);


    if (result.affectedRows === 0) {
        throw new Error('Order not found');
    }


    return {
        message: 'Order status updated'
    };
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
};